import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve a specific question by ID with its answers
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      include: {
        Reponses: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the question" },
      { status: 500 }
    );
  }
}

// PUT: Update a specific question by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await req.json();
    const { texte_question, Reponses } = data;

    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        texte_question,
        Reponses: {
          deleteMany: {}, // Delete existing reponses
          create: Reponses, // Create new reponses
        },
      },
    });

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the question" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific question by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.question.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the question" },
      { status: 500 }
    );
  }
}
