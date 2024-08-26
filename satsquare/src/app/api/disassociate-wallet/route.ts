import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Update the user's walletId to null in the database
    await prisma.utilisateur.update({
      where: { id: userId },
      data: { walletId: null },
    });

    return NextResponse.json({ message: 'Wallet disassociated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error disassociating wallet:', error);
    return NextResponse.json({ message: 'Failed to disassociate wallet' }, { status: 500 });
  }
}
