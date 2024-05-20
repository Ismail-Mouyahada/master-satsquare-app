import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/connect';

// GET: Récupérer tous les sponsors ou rechercher par nom
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    let sponsors;
    if (name) {
      sponsors = await prisma.sponsor.findMany({
        where: {
          nom: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      sponsors = await prisma.sponsor.findMany();
    }

    return NextResponse.json(sponsors, { status: 200 });
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return NextResponse.json({ error: "An error occurred while fetching sponsors" }, { status: 500 });
  }
}

// POST: Créer un nouveau sponsor
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newSponsor = await prisma.sponsor.create({
      data,
    });
    return NextResponse.json(newSponsor, { status: 201 });
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return NextResponse.json({ error: "An error occurred while creating the sponsor" }, { status: 500 });
  }
}
