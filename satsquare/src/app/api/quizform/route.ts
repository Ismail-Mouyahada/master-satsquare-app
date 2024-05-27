import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/connect';

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get('name');
  
      let quizzes;
      if (name) {
        quizzes = await prisma.quiz.findMany({
          where: {
            titre: {
              contains: name,
              mode: 'insensitive',
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
      } else {
        quizzes = await prisma.quiz.findMany({
                  include: {
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
      console.error("Error fetching sponsors:", error);
      return NextResponse.json({ error: "An error occurred while fetching sponsors" }, { status: 500 });
    }
  }


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
            create: questions.map((question: { texte_question: string; reponses: { texte_reponse: string; est_correcte: boolean; }[]; }) => ({
              texte_question: question.texte_question,
              Reponses: {
                create: question.reponses.map((reponse: { texte_reponse: string; est_correcte: boolean; }) => ({
                  texte_reponse: reponse.texte_reponse,
                  est_correcte: reponse.est_correcte,
                })),
              },
            })),
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
  
      return NextResponse.json(newQuiz, { status: 201 });
    } catch (error) {
      console.error("Error creating quiz:", error);
      return NextResponse.json({ error: "An error occurred while creating the quiz" }, { status: 500 });
    }
  }