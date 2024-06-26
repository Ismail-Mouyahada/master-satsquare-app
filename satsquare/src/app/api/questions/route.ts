import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve all questions
export async function GET(req: NextRequest) {
  try {
    const questions = await prisma.question.findMany({
      include: {
        Reponses: true,
      },
    });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching questions" },
      { status: 500 }
    );
  }
}

// POST: Create a new question
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { texte_question, quiz_id, Reponses } = data;
    const question = await prisma.question.create({
      data: {
        texte_question,
        quiz_id,
        Reponses: {
          create: Reponses,
        },
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the question" },
      { status: 500 }
    );
  }
}
