import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    // Convert the request body to JSON and extract walletId
    const requestBody = await req.json();
    const { walletId } = requestBody;

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is missing' }, { status: 400 });
    }

    // Fetch wallet details using the LNbits API
    const response = await axios.get('https://lightning.ismail-mouyahada.com/api/v1/wallet', {
      headers: {
        'X-Api-Key': process.env.LNBITS_API_KEY || 'c0081b6f59d749c1984a916afddec8c1', // Use API key from environment variables or fallback
        'Accept': 'application/json',
      },
    });

    const wallets = response.data.wallets;

    if (!wallets || wallets.length === 0) {
      return NextResponse.json({ error: 'No wallets found' }, { status: 404 });
    }

    // Find the wallet by ID
    const wallet = wallets.find((w: any) => w.id === walletId);

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Map the wallet data
    const walletDetails = {
      id: wallet.id,
      name: wallet.name,
      balance: wallet.balance_msat / 1000, // Convert millisatoshis to satoshis
    };

    return NextResponse.json(walletDetails, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching wallet details:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch wallet details' }, { status: 500 });
  }
}
