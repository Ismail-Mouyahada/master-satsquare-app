import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { exclude } from "@/utils/utils";

// Utility function to handle BigInt serialization
function handleBigInt(value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

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

    // Exclude the mot_de_passe field from each user and handle BigInt
    utilisateurs = utilisateurs.map((utilisateur) => {
      const userWithoutPassword = exclude(utilisateur, ["mot_de_passe"]);
      return JSON.parse(
        JSON.stringify(userWithoutPassword, (_, value) => handleBigInt(value))
      );
    });

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

    // Hash the password if it exists
    if (data.mot_de_passe) {
      const saltRounds = 10;
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, saltRounds);
    }

    const newUtilisateur = await prisma.utilisateur.create({
      data: {
        pseudo: data.pseudo,
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        statutCompte: data.statut_compte,
        role: {
          connect: {
            id: data.roleId,
          },
        },
      },
    });

    // Exclude mot_de_passe from the response and handle BigInt
    const responseUtilisateur = exclude(newUtilisateur, ["mot_de_passe"]);
    const serializedResponse = JSON.parse(
      JSON.stringify(responseUtilisateur, (_, value) => handleBigInt(value))
    );

    return NextResponse.json(serializedResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating utilisateur:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the utilisateur" },
      { status: 500 }
    );
  }
}
