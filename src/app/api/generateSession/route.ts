// // @ts-ignore
// import { BreezeConnect } from "breezeconnect";
// import { NextResponse } from 'next/server';
// import { iciciConfig } from "@/app/_config/iciciDirect";
// const breeze = new BreezeConnect({ "appKey": iciciConfig.apiKey });

// export async function GET() {
//   try {
//     await breeze.generateSession(iciciConfig.secretKey, iciciConfig.sessionKey).then((res:Response) => {
//       return NextResponse.json(res);
//     });
//     return new NextResponse('Failed to fetch details', { status: 500 });
//   } catch (error: any) {
//     console.error('Error fetching customer details:', error.response?.data || error.message);
//     return new NextResponse('Failed to fetch details', { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { iciciConfig, breeze } from "@/app/_config/iciciDirect";

export async function GET() {
  try {
    await breeze.generateSession(iciciConfig.secretKey, iciciConfig.sessionKey);
    const res = await apiCalls()
    return NextResponse.json(res);
  } catch (error: any) {
    console.error('Error fetching customer details:', error);
    return new NextResponse('Failed to fetch details', { status: 500 });
  }
}

async function apiCalls() {
  try {
      const res = await breeze.getFunds();
      return res;
  } catch (err) {
      console.error("API call failed:", err);
      return null;
  }
}