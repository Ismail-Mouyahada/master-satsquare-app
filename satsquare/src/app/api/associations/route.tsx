import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Récupérer toutes les associations ou rechercher par nom
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    let associations;
    if (name) {
      associations = await prisma.association.findMany({
        where: {
          nom: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
    } else {
      associations = await prisma.association.findMany();
    }

    return NextResponse.json(associations, { status: 200 });
  } catch (error) {
    console.error("Error fetching associations:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching associations" },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle association
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

    const newAssociation = await prisma.association.create({
      data,
    });

    return NextResponse.json(newAssociation, { status: 201 });
  } catch (error) {
    console.error("Error creating association:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the association" },
      { status: 500 }
    );
  }
}
