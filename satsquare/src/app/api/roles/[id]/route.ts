import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// PUT: Mettre à jour un role existant
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedRoles = await prisma.role.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedRoles, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the role" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un role existant
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.role.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the role" },
      { status: 500 }
    );
  }
}
