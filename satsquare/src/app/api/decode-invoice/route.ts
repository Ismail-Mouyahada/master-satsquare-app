import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { invoice } = await req.json();

    const response = await axios.post('https://lightning.ismail-mouyahada.com/api/v1/payments/decode', {
      data: invoice,
    }, {
      headers: {
        'X-Api-Key': process.env.LNBITS_INVOICE_KEY || 'c0081b6f59d749c1984a916afddec8c1',
        'Content-Type': 'application/json',
      },
    });

    const decodedInvoice = response.data;
    return NextResponse.json(decodedInvoice, { status: 200 });
  } catch (error: any) {
    console.error('Error decoding invoice:', error.message || error);
    return NextResponse.json({ error: 'Failed to decode invoice' }, { status: 500 });
  }
}
