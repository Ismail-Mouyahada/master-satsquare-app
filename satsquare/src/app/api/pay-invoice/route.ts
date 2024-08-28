import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { bolt11 } = await req.json();

    const response = await axios.post('https://lightning.ismail-mouyahada.com/api/v1/payments', {
      out: true,
      bolt11,
    }, {
      headers: {
        'X-Api-Key': process.env.LNBITS_ADMIN_KEY || 'fa3b38060cfe40e6abede9769997257c',
        'Content-Type': 'application/json',
      },
    });

    const payment = response.data;
    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Error paying invoice:', error.message || error);
    return NextResponse.json({ error: 'Failed to pay invoice' }, { status: 500 });
  }
}
