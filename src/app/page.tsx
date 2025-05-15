// 'use client';
// import { useEffect, useState } from 'react';
// import { fetchStockPrice, fetchStockName, generateSession, fetchStocks } from '@/app/_components/StockBreeze';
// import 'bootstrap/dist/css/bootstrap.min.css';

// interface Stock {
//   code: string;
//   name: string;
//   price?: number;
// }

// interface Stocks {
//   stockCode: string,
//   stockName: string
// }

// const StockTable = () => {
//   const [stocks, setStocks] = useState<Stock[]>([]);
//   const [searchStock, setSearchStock] = useState<Stocks[]>([]);
//   const [newCode, setNewCode] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
//   const [isRefreshingAll, setIsRefreshingAll] = useState(false);

//   const addStock = async () => {
//     if (!newCode.trim()) return;
//     setIsLoading(true);

//     const code = newCode.toUpperCase();
//     try {
//       const [price, name] = await Promise.all([
//         fetchStockPrice(code),
//         fetchStockName(code)
//       ]);
//       const stock: Stock = { code, name, price };
//       setStocks([...stocks, stock]);
//       setNewCode('');
//     } catch (err) {
//       alert('Failed to fetch stock data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshStock = async (index: number) => {
//     setLoadingIndex(index);
//     try {
//       const updatedStocks = [...stocks];
//       const price = await fetchStockPrice(updatedStocks[index].code);
//       updatedStocks[index].price = price;
//       setStocks(updatedStocks);
//     } catch (err) {
//       alert('Failed to refresh stock.');
//     } finally {
//       setLoadingIndex(null);
//     }
//   };

//   const refreshAll = async () => {
//     setIsRefreshingAll(true);
//     try {
//       const updated = await Promise.all(
//         stocks.map(async (stock) => ({
//           ...stock,
//           price: await fetchStockPrice(stock.code),
//         }))
//       );
//       setStocks(updated);
//     } catch (err) {
//       alert('Failed to refresh all stocks.');
//     } finally {
//       setIsRefreshingAll(false);
//     }
//   };

//   const getStocks = async () => {
//     const data = await fetchStocks();
//     setSearchStock(data.data)
//     localStorage.setItem('_key_data-stocks', data.data)
//   }

//   useEffect(() => {
//     generateSession()
//     if(localStorage.getItem('_key_data-stocks')) {
//       const data = localStorage.getItem('_key_data-stocks');
//       const parsedData = data ? JSON.parse(data) : [];

//       setSearchStock(parsedData as Array<Stocks>);
//     }
//     else {
//       getStocks()
//     }
//   }, [])

//   return (
//     <div className="container py-4">
//       <h1 className="mb-4">📈 Stock Prices</h1>

//       <div className="row g-2 mb-3">
//         <div className="col-md-8">
//           <input
//             type="text"
//             placeholder="Enter Stock Code (e.g. INFY)"
//             className="form-control"
//             value={newCode}
//             onChange={(e) => setNewCode(e.target.value)}
//           />
//         </div>
//         <div className="col-md-2 d-grid">
//           <button
//             onClick={addStock}
//             className="btn btn-primary"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : (
//               'Add Stock'
//             )}
//           </button>
//         </div>
//         <div className="col-md-2 d-grid">
//           <button
//             onClick={refreshAll}
//             className="btn btn-success"
//             disabled={isRefreshingAll}
//           >
//             {isRefreshingAll ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : (
//               'Refresh All'
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered table-hover align-middle">
//           <thead className="table-light">
//             <tr>
//               <th>Code</th>
//               <th>Name</th>
//               <th>Last Price</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stocks.length > 0 ? (
//               stocks.map((stock, i) => (
//                 <tr key={i}>
//                   <td>{stock.code}</td>
//                   <td>{stock.name}</td>
//                   <td>
//                     {stock.price !== undefined ? (
//                       <span className="badge bg-secondary">
//                         ₹{stock.price.toFixed(2)}
//                       </span>
//                     ) : (
//                       'N/A'
//                     )}
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => refreshStock(i)}
//                       className="btn btn-warning btn-sm"
//                       disabled={loadingIndex === i}
//                     >
//                       {loadingIndex === i ? (
//                         <span className="spinner-border spinner-border-sm" role="status" />
//                       ) : (
//                         'Refresh'
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center text-muted py-4">
//                   No stocks added yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StockTable;
'use client';
import { useEffect, useState } from 'react';
import { getDetails, fetchStocks } from './_components/StockGoogle';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Stock {
  code: string;
  name: string;
  price?: number;
}

interface Stocks {
  stockCode: string;
  stockName: string;
}

const StockTable = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchStock, setSearchStock] = useState<Stocks[]>([]);
  const [newCode, setNewCode] = useState<string>(''); // For storing user input
  const [filteredStocks, setFilteredStocks] = useState<Stocks[]>([]); // For filtered results based on user input
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  // Adding a stock to the list
  const addStock = async () => {
    if (!newCode.trim()) return;
    setIsLoading(true);

    // Find the stock by name (case-insensitive)
    const stock = searchStock.find(
      (stock) => stock.stockName.toLowerCase() === newCode.toLowerCase()
    );

    if (stock) {
      try {
        const result = await getDetails(stock.stockCode)
        const newStock = { code: stock.stockCode, name: stock.stockName, price: result.price };
        setStocks([...stocks, newStock]);
        setNewCode(''); // Clear input after adding stock
      } catch (err) {
        alert('Failed to fetch stock data.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Stock not found.');
      setIsLoading(false);
    }
  };

  // Refreshing stock data for a specific stock
  const refreshStock = async (index: number) => {
    setLoadingIndex(index);
    try {
      const updatedStocks = [...stocks];
      const result = await getDetails(updatedStocks[index].code); // returns { price: number }
      updatedStocks[index].price = result.price; // correctly assign the number
      setStocks(updatedStocks);
    } catch (err) {
      alert('Failed to refresh stock.');
    } finally {
      setLoadingIndex(null);
    }
  };

  // Refreshing stock data for all stocks
  const refreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (stock) => ({
          ...stock,
          price: (await getDetails(stock.code)).price
        }))
      );
      setStocks(updated);
    } catch (err) {
      alert('Failed to refresh all stocks.');
    } finally {
      setIsRefreshingAll(false);
    }
  };

  // Fetching the stocks data
  const getStocks = async () => {
    const data = await fetchStocks();
    setSearchStock(data.data);
    localStorage.setItem('_key_data-stocks', JSON.stringify(data.data)); // Store in localStorage
  };

  // Effect to generate session and fetch the stock data
  useEffect(() => {
    const storedData = localStorage.getItem('_key_data-stocks');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setSearchStock(parsedData);
    } else {
      getStocks();
    }
  }, []);

  // Filter stocks based on input (name matching)
  useEffect(() => {
  const trimmed = newCode.trim().toLowerCase();

  if (trimmed) {
    const filtered = searchStock.filter((stock) =>
      stock.stockName.toLowerCase().includes(trimmed)
    );

    // If input exactly matches one result, hide suggestions
    if (
      filtered.length === 1 &&
      filtered[0].stockName.toLowerCase() === trimmed
    ) {
      setFilteredStocks([]);
    } else {
      setFilteredStocks(filtered);
    }
  } else {
    setFilteredStocks([]);
  }
}, [newCode, searchStock]);

  // Handle when an option is clicked from the dropdown
  const handleOptionClick = (stockName: string) => {
    setNewCode(stockName); // Set the input field to the selected stock name
    setFilteredStocks([]);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">📈 Stock Prices</h1>

      <div className="row g-2 mb-3">
        <div className="col-md-8 position-relative">
          <input
            type="text"
            placeholder="Enter Stock Name (e.g. Apple)"
            className="form-control"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)} // Update the input value as user types
          />
          {filteredStocks.length > 0 && (
            <ul
              className="list-group position-absolute mt-2 w-100 z-index-100 border"
              style={{ maxHeight: '200px', overflowY: 'auto' }} // Scrollable list
            >
              {filteredStocks.map((stock, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleOptionClick(stock.stockName)} // Handle selection
                  style={{ cursor: 'pointer' }}
                >
                  {stock.stockName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-md-2 d-grid">
          <button
            onClick={addStock}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Add Stock'
            )}
          </button>
        </div>
        <div className="col-md-2 d-grid">
          <button
            onClick={refreshAll}
            className="btn btn-success"
            disabled={isRefreshingAll}
          >
            {isRefreshingAll ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Refresh All'
            )}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Last Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock, i) => (
                <tr key={i}>
                  <td>{stock.code}</td>
                  <td>{stock.name}</td>
                  <td>
                    {stock.price !== undefined ? (
                      <span className="badge bg-secondary">
                        {stock.price}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => refreshStock(i)}
                      className="btn btn-warning btn-sm"
                      disabled={loadingIndex === i}
                    >
                      {loadingIndex === i ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                      ) : (
                        'Refresh'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No stocks added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;