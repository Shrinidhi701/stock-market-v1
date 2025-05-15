import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio'; // ✅ Correct

export async function GET(req: any) {
  try {
    const stockCode = req.headers.get('stockCode');
    const url = `https://www.google.com/finance/quote/${stockCode}:NSE`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0' // Important to avoid being blocked by Google
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const price = $('div.YMlKec.fxKbKc').first().text();
    const name = $('div.zzDege').first().text();

    return NextResponse.json({price, name, stockCode}, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching stock price:', error);
    return new NextResponse('Failed to fetch stock price', { status: 500 });
  }
}
