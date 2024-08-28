import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma'; // Import your Prisma client

// Utility function to handle BigInt serialization
function serializeWithBigInt(obj: any) {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // Log the incoming request payload
    console.log('Received request payload:', requestData);

    // Extract and set default values
    const {
      userId = 'defaultUserId', // Set a default userId if none is provided
      walletId = 'defaultWalletId', // Set a default walletId if none is provided
      balance = 0, // Set balance to '0' if none is provided
    } = requestData;

    // Validate required fields (after applying default values)
    if (!userId || !walletId || balance === null || balance === undefined) {
      console.error('Missing or invalid fields:', { userId, walletId, balance });
      return NextResponse.json(
        { error: 'Missing or invalid fields: userId, walletId, or balance' },
        { status: 400 }
      );
    }

    // Convert balance to BigInt if it's a valid number or string
    let balanceBigInt;
    try {
      balanceBigInt = BigInt(balance);
    } catch (conversionError) {
      console.error('Error converting balance to BigInt:', conversionError);
      return NextResponse.json(
        { error: 'Invalid balance value; unable to convert to BigInt' },
        { status: 400 }
      );
    }

    // Update user with wallet details
    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: { walletId, balance: balanceBigInt }, // Store balance as BigInt
    });

    // Serialize response to handle BigInt
    const serializedUser = serializeWithBigInt(updatedUser);

    return new NextResponse(serializedUser, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error updating wallet details:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to update wallet details' },
      { status: 500 }
    );
  }
}
