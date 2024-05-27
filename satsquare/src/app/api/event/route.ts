import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/connect";

// POST: Créer un nouveau événement
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newEvent = await prisma.evenement.create({
      data: {
        nom: data.nom,
        description: data.description,
        est_public: data.est_public === "public",
        est_gratuit: data.participation === "free",
        commence_a: new Date(data.commence_a),
        termine_a: new Date(data.termine_a),
        sat_minimum: data.sat_minimum,
        recompense_joueurs: data.recompense_joueurs,
        don_association: data.don_association,
        don_plateforme: data.don_plateforme,
        EvenementsQuiz: {
          connect: data.quizzes.map((quizId: string) => ({
            id: parseInt(quizId),
          })),
        },
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the event" },
      { status: 500 }
    );
  }
}
