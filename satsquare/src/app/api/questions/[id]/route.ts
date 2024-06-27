import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve a question by id or all questions if no id is provided
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const question = await prisma.question.findUnique({
        where: { id: Number(id) },
        include: {
          Reponses: true,
        },
      });

      if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }

      return NextResponse.json(question, { status: 200 });
    } else {
      const questions = await prisma.question.findMany({
        include: {
          Reponses: true,
        },
      });

      return NextResponse.json(questions, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching question(s):", error);
    return NextResponse.json(
      { error: "An error occurred while fetching question(s)" },
      { status: 500 }
    );
  }
}

// POST: Create a new question
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No body received." }, { status: 400 });
    }

    const newQuestion = await prisma.question.create({
      data,
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the question" },
      { status: 500 }
    );
  }
}

// PUT: Update a question by id
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No id provided." }, { status: 400 });
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No body received." }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data,
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

// DELETE: Delete a question by id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json({ error: "No id provided." }, { status: 400 });
    }

    await prisma.question.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the question" },
      { status: 500 }
    );
  }
}
