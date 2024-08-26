import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { EvenementsQuiz } from '../../../types/datatypes';

// POST: Créer un nouveau événement
export async function POST(req: NextRequest) {
  try {
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return NextResponse.json({ error: "No body received." }, { status: 400 });
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No body received." }, { status: 400 });
    }

    const newEvent = await prisma.evenement.create({
      data: {
        nom: data.nom,
        description: data.description,
        estPublic: data.est_public === "public",
        estGratuit: data.participation === "free",
        commenceA: new Date(data.commence_a),
        termineA: new Date(data.termine_a),
        satMinimum: data.sat_minimum,
        recompenseJoueurs: data.recompense_joueurs,
        donAssociation: data.don_association,
        donPlateforme: data.don_plateforme,
        evenementsQuiz: {
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
