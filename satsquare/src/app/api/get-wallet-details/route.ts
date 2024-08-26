import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';
import { getToken } from 'next-auth/jwt'; // Import getToken for NextRequest context

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    // Get the user session token
    const token = await getToken({ req, secret });

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Not authenticated', details: 'User session not found' },
        { status: 401 }
      );
    }

    const email = token.email;
    console.log('email:', email);

    const wallet = await prisma.utilisateur.findFirst({
      where: {
        email: email,
      },
    });

    console.log('wallet:', wallet);

    if (!wallet || !wallet.walletId) {
      return NextResponse.json(
        { error: 'Failed to fetch wallet details', details: 'Wallet not found or Wallet ID missing' },
        { status: 404 }
      );
    }

    const response = await fetch(`https://lightning.ismail-mouyahada.com/api/v1/auth?usr=${wallet.walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error fetching wallet details from external API:', errorDetails);
      return NextResponse.json(
        { error: 'Failed to fetch wallet details from external API', details: errorDetails },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log('response:', responseData);

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching wallet details:', error.message || error);

    return NextResponse.json(
      { error: 'Failed to fetch wallet details', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
