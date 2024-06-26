import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve a specific quiz by ID with its questions and answers
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id) },
      include: {
        Questions: {
          include: {
            Reponses: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the quiz" },
      { status: 500 }
    );
  }
}

// PUT: Update a specific quiz by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await req.json();
    const { titre, user_id, categorie, questions } = data;

    // Update quiz details
    const updatedQuiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: {
        titre,
        user_id,
        categorie,
        Questions: {
          deleteMany: {}, // Delete existing questions
          create: questions.map(
            (question: {
              texte_question: string;
              reponses: { texte_reponse: string; est_correcte: boolean }[];
            }) => ({
              texte_question: question.texte_question,
              Reponses: {
                create: question.reponses.map(
                  (reponse: {
                    texte_reponse: string;
                    est_correcte: boolean;
                  }) => ({
                    texte_reponse: reponse.texte_reponse,
                    est_correcte: reponse.est_correcte,
                  })
                ),
              },
            })
          ),
        },
      },
      include: {
        Questions: {
          include: {
            Reponses: true,
          },
        },
      },
    });

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the quiz" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific quiz by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  try {
    await prisma.quiz.delete({
      where: { id: Number(id) },
      include: {
        Questions: {
          include: {
            Reponses: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the quiz" },
      { status: 500 }
    );
  }
}
