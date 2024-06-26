import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getQuizById = async (quizId: number) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      Questions: {
        include: {
          Reponses: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  return quiz;
};
