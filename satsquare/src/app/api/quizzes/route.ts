import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/connect';

// GET: Fetch all quizzes or search by title
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    let quizzes;
    if (title) {
      quizzes = await prisma.quiz.findMany({
        where: {
          titre: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: {
          utilisateur: true,
          Questions: {
            include: {
              Reponses: true,
            },
          },
        },
      });
    } else {
      quizzes = await prisma.quiz.findMany({
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

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "An error occurred while fetching quizzes" }, { status: 500 });
  }
}

// POST: Create a new quiz
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { titre, user_id, categorie, questions } = data;
    const newQuiz = await prisma.quiz.create({
      data: {
        titre,
        user_id,
        categorie,
        Questions: {
          create: questions,
        },
      },
    });

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "An error occurred while creating the quiz" }, { status: 500 });
  }
}
