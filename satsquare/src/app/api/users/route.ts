import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

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
        mis_a_jour_le: new Date()
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
