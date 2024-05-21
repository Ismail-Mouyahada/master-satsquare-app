import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/connect";

// GET: Récupérer tous les roles ou rechercher par nom
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    let roles;
    if (name) {
      roles = await prisma.role.findMany({
        where: {
          nom: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
    } else {
      roles = await prisma.role.findMany();
    }

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching roles" },
      { status: 500 }
    );
  }
}

// POST: Créer un nouveau role
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newRole = await prisma.role.create({
      data,
    });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the role" },
      { status: 500 }
    );
  }
}
