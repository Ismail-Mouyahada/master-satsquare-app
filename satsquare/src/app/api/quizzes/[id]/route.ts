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

// Helper function to fetch a quiz by ID
async function getQuizById(id: string) {
  return prisma.quiz.findUnique({
    where: { id: Number(id) },
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

// Helper function to update a quiz by ID
async function updateQuizById(id: string, data: any) {
  const { subject, password, questions } = data;

  return prisma.quiz.update({
    where: { id: Number(id) },
    data: {
      subject,
      password,
      questions: {
        deleteMany: {}, // delete existing questions
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
    include: {
      questions: {
        include: {
          playersAnswers: true,
        },
      },
    },
  });
}

// Helper function to delete a quiz by ID
async function deleteQuizById(id: string) {
  return prisma.quiz.delete({
    where: { id: Number(id) },
  });
}

// GET: Fetch quiz by ID
export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  try {
    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(handleBigInt(quiz), { status: 200 });
  } catch (error) {
    console.error(`Error fetching quiz with ID ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while fetching the quiz" },
      { status: 500 }
    );
  }
}

// PUT: Update quiz by ID
export async function PUT(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updatedQuiz = await updateQuizById(id, data);
    return NextResponse.json(handleBigInt(updatedQuiz), { status: 200 });
  } catch (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while updating the quiz" },
      { status: 500 }
    );
  }
}

// DELETE: Delete quiz by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  try {
    await deleteQuizById(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while deleting the quiz" },
      { status: 500 }
    );
  }
}
