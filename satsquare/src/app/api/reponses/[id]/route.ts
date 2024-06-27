import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
<<<<<<< HEAD

// Helper function to fetch a reponse by ID
async function getReponseById(id: string) {
  return prisma.reponse.findUnique({
    where: { id: Number(id) },
  });
}

// Helper function to update a reponse by ID
async function updateReponseById(id: string, data: any) {
  const { texte_reponse, est_correcte } = data;
  return prisma.reponse.update({
    where: { id: Number(id) },
    data: {
      texte_reponse,
      est_correcte,
    },
  });
}

// Helper function to delete a reponse by ID
async function deleteReponseById(id: string) {
  return prisma.reponse.delete({
    where: { id: Number(id) },
  });
}

// GET: Fetch reponse by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Reponse ID is required" }, { status: 400 });
  }

  try {
    const reponse = await getReponseById(id);
    if (!reponse) {
      return NextResponse.json({ error: "Reponse not found" }, { status: 404 });
    }
    return NextResponse.json(reponse, { status: 200 });
  } catch (error) {
    console.error(`Error fetching reponse with ID ${id}:`, error);
    return NextResponse.json({ error: "An error occurred while fetching the reponse" }, { status: 500 });
  }
}

// PUT: Update reponse by ID
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Reponse ID is required" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updatedReponse = await updateReponseById(id, data);
    return NextResponse.json(updatedReponse, { status: 200 });
  } catch (error) {
    console.error(`Error updating reponse with ID ${id}:`, error);
    return NextResponse.json({ error: "An error occurred while updating the reponse" }, { status: 500 });
  }
}

// DELETE: Delete reponse by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Reponse ID is required" }, { status: 400 });
  }

  try {
    await deleteReponseById(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting reponse with ID ${id}:`, error);
    return NextResponse.json({ error: "An error occurred while deleting the reponse" }, { status: 500 });
=======
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
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
  }
}
