import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { amount, memo } = await req.json();

    const response = await axios.post('https://lightning.ismail-mouyahada.com/api/v1/payments', {
      out: false,
      amount,
      memo,
      expiry: 3600, // Optional expiry time in seconds
      unit: 'sat',  // Unit of the amount
    }, {
      headers: {
        'X-Api-Key': process.env.LNBITS_INVOICE_KEY || 'c0081b6f59d749c1984a916afddec8c1',
        'Content-Type': 'application/json',
      },
    });

    const invoice = response.data;
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error.message || error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
