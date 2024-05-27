import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserDTO } from "@/types/userDTO";
import { exclude } from "../utilisateurs/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 1;
    const newUser = await prisma.utilisateur.create({
      data: {
        email,
        pseudo: username,
        role_id: role,
        mot_de_passe: hashedPassword,
        statut_compte: true,
        cree_le: new Date(),
        mis_a_jour_le: new Date(),
      },
    });

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function mapToUserDTO(user: any): UserDTO {
  return {
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    role: user.role?.nom || null,
    association_id: user.association_id,
    sponsor_id: user.sponsor_id,
  };
}

// GET: Récupérer un utilisateur par email
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!utilisateur) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Exclure le champ mot_de_passe
    const utilisateurSansMotDePasse = exclude(utilisateur, ["mot_de_passe"]);

    // Mapper vers le DTO
    const userDTO = mapToUserDTO(utilisateurSansMotDePasse);

    return NextResponse.json(userDTO, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user" },
      { status: 500 }
    );
  }
}
