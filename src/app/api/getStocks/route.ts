import { NextResponse } from 'next/server';
import db from '@/app/_config/db'

export async function GET() {
    try{
        const query = "SELECT stockCode, stockName FROM ta_stockList";
        const [rows] = await db.query(query);
        if(Array.isArray(rows) && rows.length > 0) {
            return NextResponse.json({ data: rows }, { status: 200 })
        }
        else {
            return NextResponse.json({ msg: 'No Rows Found!' }, { status: 404 })
        }
    } catch(error:any) {
        console.error("Error parsing CSV:", error.message);
        return NextResponse.json(
        { error: 'Failed to fetch or parse CSV', details: error.message },
        { status: 500 }
        );
    }
} 