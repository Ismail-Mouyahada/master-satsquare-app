import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/connect";
import bcrypt from "bcrypt";

// Fonction pour exclure des clés d'un objet
export function exclude<
  User extends { [key: string]: any },
  Key extends keyof User,
>(user: User, keys: Key[]): Omit<User, Key> {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<User, Key>;
}

// GET: Récupérer tous les utilisateurs ou rechercher par nom
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

    // Exclure le champ mot_de_passe de chaque utilisateur
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

// POST: Créer un nouveau utilisateur
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

    return NextResponse.json(newUtilisateur, { status: 201 });
  } catch (error) {
    console.error("Error creating utilisateur:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the utilisateur" },
      { status: 500 }
    );
  }
}
