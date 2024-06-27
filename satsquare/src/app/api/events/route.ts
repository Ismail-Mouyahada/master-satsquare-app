import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Récupérer tous les événements ou rechercher par nom
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    let events;
    if (name) {
      events = await prisma.evenement.findMany({
        where: {
          nom: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
    } else {
      events = await prisma.evenement.findMany();
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching events" },
      { status: 500 }
    );
  }
}

// POST: Créer un nouvel événement
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
      data,
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
