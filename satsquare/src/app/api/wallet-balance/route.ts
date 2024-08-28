// app/api/wallet-balance/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const walletId = req.nextUrl.searchParams.get('walletId');

  try {
    const response = await axios.get(`https://lightning.ismail-mouyahada.com/api/v1/wallet`, {
      headers: {
        'X-Api-Key': walletId as string,
      }
    });

    const { balance } = response.data;
    return NextResponse.json({ balance }, { status: 200 });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet balance' }, { status: 500 });
  }
}
