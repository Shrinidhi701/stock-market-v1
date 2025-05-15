import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import db from '@/app/_config/db'

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const fileUrl = 'https://nsearchives.nseindia.com/content/equities/namechange.csv';
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/csv',
        'Referer': 'https://www.nseindia.com/',
        'Origin': 'https://www.nseindia.com'
      }
    });
    const csvText = Buffer.from(response.data, 'binary').toString('utf-8');
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    const values = records.map((row: any) => [
      row['NCH_SYMBOL'],
      row['NCH_NEW_NAME'],
      row['NCH_PREV_NAME'] || '',
      row['NCH_DT'] || ''
    ]);

    if (values.length === 0) {
      return NextResponse.json({ message: 'No records to insert' }, { status: 404 });
    }

    const sql = `
      INSERT INTO ta_stockList (stockCode, stockName, oldStockName, nameChangeDate)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        stockName = VALUES(stockName),
        oldStockName = VALUES(oldStockName),
        nameChangeDate = VALUES(nameChangeDate)
    `;

    await db.query(sql, [values]);

    return NextResponse.json({ inserted: values.length }, { status: 200 });
  } catch (error: any) {
    console.error("Error parsing CSV:", error.message);
    return NextResponse.json(
      { error: 'Failed to fetch or parse CSV', details: error.message },
      { status: 500 }
    );
  }
}
