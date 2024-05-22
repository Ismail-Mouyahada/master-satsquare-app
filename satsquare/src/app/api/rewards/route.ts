import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/connect";
import { RewardDTO } from "@/types/rewardDTO";

// GET: Récupérer les récompenses
export async function GET(req: NextRequest) {
  try {
    const dons = await prisma.don.findMany({
      include: {
        sponsor: true,
      },
    });

    const rewards: RewardDTO[] = dons.map((don) => ({
      sponsor: don.sponsor.nom,
      montant: don.montant,
      portefeuille: don.sponsor.adresse_eclairage,
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
