import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve an existing association by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const association = await prisma.association.findUnique({
      where: { id: Number(id) },
    });
    if (association) {
      return NextResponse.json(association, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Association not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error retrieving association:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving the association" },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour une association existante
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedAssociation = await prisma.association.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedAssociation, { status: 200 });
  } catch (error) {
    console.error("Error updating association:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the association" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer une association existante
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.association.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Association deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting association:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the association" },
      { status: 500 }
    );
  }
}
