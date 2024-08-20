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
    const { userId, walletId, balance } = await req.json();

    // Update user with wallet details
    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: { walletId, balance: BigInt(balance) }, // Store balance as BigInt
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
    return NextResponse.json({ error: 'Failed to update wallet details' }, { status: 500 });
  }
}
