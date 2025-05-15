export const getDetails = async (stockCode: string) => {
    try{
        const url = "/api/getDetails";
        const Response = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'stockCode': stockCode
            }
        });
        if(Response.status == 200) {
            const data = await Response.json();
            return data
        }
    }catch(error:any) {
        console.error(error);
        return null;
    }
}

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