import { NextResponse } from 'next/server';
import { breeze } from "@/app/_config/iciciDirect";

export async function GET(req: any) {
  try {
    const stockCode = req.headers.get('stockCode');
    console.log(stockCode);
    if (!stockCode) {
      return new NextResponse('Stock code is missing in headers', { status: 400 });
    }
    const date = new Date();
    const response = await breeze.getQuotes({ stockCode: stockCode, exchangeCode: 'NSE', expiryDate: date.toISOString(), productType: 'cash', right: 'Others', strikePrice: 0 });
    if((response.Success) != null) {
      return new NextResponse((response.Success)[(response.Success).length- 1].previous_close, { status: 200 });
    }
    return new NextResponse('No Company Found', { status: 500 });
  } catch (error: any) {
    console.error('Error fetching customer details:', error);
    return new NextResponse('Failed to fetch details', { status: 500 });
  }
}