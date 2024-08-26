import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
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

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://lightning.ismail-mouyahada.com/api/v1/wallet',
      headers: { 
        'x-api-key': wallet.walletId,
      },
    };

    const response = await axios.request(config);
    console.log('response:', response.data);

    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch wallet details from external API', details: error.message },
        { status: error.response?.status || 500 }
      );
    }

    console.error('Error fetching wallet details:', error.message || error);

    return NextResponse.json(
      { error: 'Failed to fetch wallet details', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
