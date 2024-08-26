import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Evenement } from "@/types/main-types/main";


// POST: Créer un nouveau événement
export async function POST(req: NextRequest) {
  try {
    let data : Evenement;
    try {
      data    = await req.json();
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
        estPublic: data.estPublic  || false,
        estGratuit: data.estGratuit  ,
        commenceA: new Date(data.commenceA),
        termineA: new Date(data.termineA),
        satMinimum: data.satMinimum,
        recompenseJoueurs: data.recompenseJoueurs,
        donAssociation: data.donAssociation,
        donPlateforme: data.donPlateforme
      }});

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the event" },
      { status: 500 }
    );
  }
}
