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
    const utilisateurs = await prisma.utilisateur.findMany({
      include: {
        EvenementsQuiz: true,
      },
    });

    const userRankings: UserRankingDTO[] = utilisateurs.map(
      (utilisateur, index) => {
        const { points, wins } = calculatePointsAndWins(
          utilisateur.EvenementsQuiz
        );

        return {
          classement: index + 1,
          pseudo: utilisateur.pseudo,
          participation: utilisateur.EvenementsQuiz.length,
          nombre_de_victoire: wins,
          point: points,
        };
      }
    );

    userRankings.sort((a, b) => b.point - a.point);

    userRankings.forEach((user, index) => {
      user.classement = index + 1;
    });

    return NextResponse.json(userRankings, { status: 200 });
  } catch (error) {
    console.error("Error fetching user rankings:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user rankings" },
      { status: 500 }
    );
  }
}
