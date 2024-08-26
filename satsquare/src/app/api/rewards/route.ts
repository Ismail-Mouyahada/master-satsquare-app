import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { RewardDTO } from "@/types/rewardDTO";

// GET: Récupérer les récompenses
export async function GET(req: NextRequest) {
  try {
    const dons = await prisma.don.findMany({
      include: {
        sponsor: true,
      },
    });

    const rewards: RewardDTO[] = dons.map((don:any) => ({
      sponsor: don.sponsor.nom,
      montant: don.montant,
      portefeuille: don.sponsor.adresseEclairage,
    }));

    return NextResponse.json(rewards, { status: 200 });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rewards" },
      { status: 500 }
    );
  }
}
