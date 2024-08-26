import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve all questions
export async function GET(req: NextRequest) {
  try {
    const questions = await prisma.question.findMany({
      include: {
        playersAnswers: true,
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

    const { quizId, time, image, answers, cooldown, question, solution } = data;

    const newQuestion = await prisma.question.create({
      data: {
        quizId,
        time,
        image,
        answers,
        cooldown,
        question,
        solution,
        playersAnswers: {
          create: data.playersAnswers || [],
        },
      },
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
