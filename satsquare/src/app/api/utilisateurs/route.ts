import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { exclude } from "@/utils/utils";
 
 

// GET: Fetch all users or search by name
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    let utilisateurs;
    if (name) {
      utilisateurs = await prisma.utilisateur.findMany({
        where: {
          pseudo: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          role: true,
        },
      });
    } else {
      utilisateurs = await prisma.utilisateur.findMany({
        include: {
          role: true,
        },
      });
    }

    // Exclude the mot_de_passe field from each user
    utilisateurs = utilisateurs.map((utilisateur) =>
      exclude(utilisateur, ["mot_de_passe"])
    );

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error("Error fetching utilisateurs:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching utilisateurs" },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (data.mot_de_passe) {
      const saltRounds = 10;
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, saltRounds);
    }

    const newUtilisateur = await prisma.utilisateur.create({
      data,
    });

    // Exclude mot_de_passe from the response
    const responseUtilisateur = exclude(newUtilisateur, ["mot_de_passe"]);

    return NextResponse.json(responseUtilisateur, { status: 201 });
  } catch (error) {
    console.error("Error creating utilisateur:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the utilisateur" },
      { status: 500 }
    );
  }
}
