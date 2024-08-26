import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// Helper function to convert BigInt to string in the JSON response
function handleBigInt(jsonObject: any) {
  return JSON.parse(
    JSON.stringify(jsonObject, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// GET: Fetch all quizzes or search by subject
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    let quizzes;
    if (subject) {
      quizzes = await prisma.quiz.findMany({
        where: {
          subject: {
            contains: subject,
            mode: "insensitive",
          },
        },
        include: {
          utilisateur: true,
          questions: {
            include: {
              playersAnswers: true,
            },
          },
        },
      });
    } else {
      quizzes = await prisma.quiz.findMany({
        include: {
          utilisateur: true,
          questions: {
            include: {
              playersAnswers: true,
            },
          },
        },
      });
    }

    return NextResponse.json(handleBigInt(quizzes), { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching quizzes. Please try again later." },
      { status: 500 }
    );
  }
}

// POST: Create a new quiz
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { subject, utilisateurId, password, questions } = data;

    const newQuiz = await prisma.quiz.create({
      data: {
        subject,
        password,
        utilisateur: { connect: { id: utilisateurId } },
        questions: {
          create: questions.map((question: any) => ({
            question: question.question,
            time: question.time,
            cooldown: question.cooldown,
            image: question.image,
            solution: question.solution,
            answers: question.answers,
          })),
        },
      },
    });

    return NextResponse.json(handleBigInt(newQuiz), { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the quiz. Please check your input and try again." },
      { status: 500 }
    );
  }
}
