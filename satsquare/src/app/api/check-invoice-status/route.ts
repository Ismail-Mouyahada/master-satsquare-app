import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentHash = searchParams.get('payment_hash');

  if (!paymentHash) {
    return NextResponse.json({ error: 'Payment hash is missing' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://lightning.ismail-mouyahada.com/api/v1/payments/${paymentHash}`, {
      headers: {
        'X-Api-Key': process.env.LNBITS_INVOICE_KEY || 'c0081b6f59d749c1984a916afddec8c1',
        'Accept': 'application/json',
      },
    });

    const status = response.data;
    return NextResponse.json(status, { status: 200 });
  } catch (error: any) {
    console.error('Error checking invoice status:', error.message || error);
    return NextResponse.json({ error: 'Failed to check invoice status' }, { status: 500 });
  }
}
