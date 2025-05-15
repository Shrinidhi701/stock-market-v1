export async function generateSession() {
    try {
        const Response = await fetch(`/api/generateSession`)
        if(Response.status == 200) {
        }
    } catch (err) {
        console.error("Session generation failed:", err);
    }
}

export const fetchStockName = async (stockCode: string): Promise<string> => {
  try {
    const response = await fetch('/api/fetchStockName', {
        method: 'GET',
        headers: {
            'stockCode': stockCode
        }
    });
    if(response.status == 200) {
        const data = await response.json();
        return data
    }
    else {
        return "";
    }
  } catch (error) {
    console.error('Error fetching stock name:', error);
    throw error;
  }
};

export const fetchStockPrice = async (stockCode: string): Promise<number> => {
  try {
    const response = await fetch('/api/fetchStockPrice', {
        method: 'GET',
        headers: {
            'stockCode': stockCode
        },
        cache: 'no-store'
    });
    if(response.status == 200) {
        const data = await response.json();
        return data
    }
    else if(response.status == 400) {
        const data = await response.json()
        if(data.toLowerCase().trim() == "Stock code is missing in headers".toLowerCase().trim()) {
            alert("Pls Enter a Company Code")
        }
        else if(data.toLowerCase().trim() == "No Company Found".toLowerCase().trim()) {
            alert("Pls Enter a valid Company Code")
        }
    }
    else {
        return 0;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return 0;
  }
};

export const fetchStocks = async () => {
    try{
        const response = await fetch('/api/getStocks', {
            method: 'GET',
            cache: 'no-store'
        });
        if(response.status == 200) {
            const data = await response.json();
            return data
        }
        return null
    } catch (error:any) {
        console.error('Error fetching stock price:', error);
        return null;
    }
}