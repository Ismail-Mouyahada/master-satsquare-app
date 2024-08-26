import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { UserRankingDTO } from "@/types/userRankingDTO";

const calculatePointsAndWins = (
  events: any[]
): { points: number; wins: number } => {
  let points = 0;
  let wins = 0;

  events.forEach((event) => {
    if (event.est_correcte) {
      points += event.score;
      wins += 1;
    }
  });

  return { points, wins };
};

// GET: Récupérer le classement des utilisateurs
export async function GET(req: NextRequest) {
  try {
    const scores = await prisma.topScore.findMany()
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    console.error("Error fetching user rankings:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user rankings" },
      { status: 500 }
    );
  }
}
