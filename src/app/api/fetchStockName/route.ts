import { NextResponse } from 'next/server';
import { breeze } from "@/app/_config/iciciDirect";

export async function GET(req: any) {
  try {
    const stockCode = req.headers.get('stockCode');

    if (!stockCode) {
      return new NextResponse('Stock code is missing in headers', { status: 400 });
    }
    const instruments = await breeze.getNames({ stockCode: stockCode, exchange: 'NSE' });
    return new NextResponse(
      instruments ? instruments.company_name : 'Unknown Company', 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching customer details:', error);
    return new NextResponse('Failed to fetch details', { status: 500 });
  }
}