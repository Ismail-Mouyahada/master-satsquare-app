import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve all quizzes
export async function GET(req: NextRequest) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        playersAnswers: true,
        questions: true,
      },
    });
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching quizzes" },
      { status: 500 }
    );
  }
}

// POST: Create a new quiz
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { subject, password, Questions } = data;
    const quiz = await prisma.quiz.create({
      data: {
        subject,
        password,
        questions: {
          create: Questions,
        },
      },
    });
    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the quiz" },
      { status: 500 }
    );
  }
}
