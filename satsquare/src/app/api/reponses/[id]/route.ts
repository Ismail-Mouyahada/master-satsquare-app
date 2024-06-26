import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Retrieve response by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const reponse = await prisma.reponse.findUnique({
      where: { id: Number(id) },
    });

    if (!reponse) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching response:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the response" },
      { status: 500 }
    );
  }
}

// PUT: Update response by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await req.json();
    const { texte_reponse, est_correcte } = data;

    const reponse = await prisma.reponse.update({
      where: { id: Number(id) },
      data: {
        texte_reponse,
        est_correcte,
      },
    });

    return NextResponse.json(reponse, { status: 200 });
  } catch (error) {
    console.error("Error updating response:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the response" },
      { status: 500 }
    );
  }
}

// DELETE: Delete response by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.reponse.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting response:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the response" },
      { status: 500 }
    );
  }
}
