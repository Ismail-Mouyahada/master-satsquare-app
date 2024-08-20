// src/app/api/get-wallet-details/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const LNBITS_API_KEY = process.env.LNBITS_API_KEY; // Ensure this is set

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get("walletId");

    if (!walletId) {
      return NextResponse.json(
        { error: "Wallet ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://lightning.ismail-mouyahada.com/api/v1/auth?usr=${walletId}`,
      {
        headers: {
          "X-Api-Key": LNBITS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const wallet = response.data.wallets.find((w: any) => w.id === walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: wallet.id,
      name: wallet.name,
      balance: wallet.balance_msat, // Assuming balance is in msat
    });
  } catch (error: any) {
    console.error("Error fetching wallet details:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch wallet details" },
      { status: 500 }
    );
  }
}
