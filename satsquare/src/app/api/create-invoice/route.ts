import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth/next'; // Use getServerSession for server-side session retrieval
import prisma from '@/db/prisma';
import { Utilisateur } from '@/types/datatypes';

export async function POST(req: NextRequest) {
  try {
    // Retrieve the session using the server-side utility
    const session : any = await getServerSession();
    
    // Ensure that the session exists and contains user data
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user from the database
    const user = await prisma.utilisateur.findUnique({ where: { email: session.user.email } });
    
    // Verify that the user exists in the database
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the walletId (invoice key) from the user
    const invoiceKey = user.walletId;

    // Ensure the invoice key is available
    if (!invoiceKey) {
      return NextResponse.json({ error: 'Invoice key not found' }, { status: 400 });
    }

    // Parse the request body to get amount and memo
    const { amount, memo } = await req.json();

    // Ensure the amount and memo are provided
    if (!amount || !memo) {
      return NextResponse.json({ error: 'Amount and memo are required' }, { status: 400 });
    }

    // Make a request to create an invoice
    const response = await axios.post('https://lightning.ismail-mouyahada.com/api/v1/payments', {
      out: false,
      amount,
      memo,
      expiry: 3600, // Optional expiry time in seconds
      unit: 'sat',  // Unit of the amount
    }, {
      headers: {
        'X-Api-Key': invoiceKey,
        'Content-Type': 'application/json',
      },
    });

    // Return the created invoice
    const invoice = response.data;
    return NextResponse.json(invoice, { status: 201 });

  } catch (error: any) {
    console.error('Error creating invoice:', error.message || error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
