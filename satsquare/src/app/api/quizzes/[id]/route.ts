import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Fetch quiz by ID
async function getQuizById(id: string) {
  return prisma.quiz.findUnique({
    where: { id: Number(id) },
    include: {
      utilisateur: true,
      Questions: {
        include: {
          Reponses: true,
        },
      },
    },
  });
}

// PUT: Update quiz by ID
async function updateQuizById(id: string, data: any) {
  const { titre, categorie, questions } = data;

  return prisma.quiz.update({
    where: { id: Number(id) },
    data: {
      titre,
      categorie,
      Questions: {
        deleteMany: {}, // delete existing questions
        create: questions.map((question: any) => ({
          texte_question: question.texte_question,
          Reponses: {
            create: question.reponses.map((reponse: any) => ({
              texte_reponse: reponse.texte_reponse,
              est_correcte: reponse.est_correcte,
            })),
          },
        })),
      },
    },
  });
}

// DELETE: Delete quiz by ID
async function deleteQuizById(id: string) {
  return prisma.quiz.delete({
    where: { id: Number(id) },
  });
}

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
    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error(`Error fetching quiz with ID ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while fetching the quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updatedQuiz = await updateQuizById(id, data);
    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while updating the quiz" },
      { status: 500 }
    );
  }
}

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

export async function handler(req: NextRequest) {
  switch (req.method) {
    case "GET":
      return GET(req);
    case "PUT":
      return PUT(req);
    case "DELETE":
      return DELETE(req);
    default:
      return NextResponse.json(
        { error: `Method ${req.method} Not Allowed` },
        { status: 405 }
      );
  }
}