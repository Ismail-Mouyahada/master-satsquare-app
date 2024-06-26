import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Get all questions
    const questions = await prisma.question.findMany({
      include: {
        Reponses: true,
      },
    });
    res.status(200).json(questions);
  } else if (req.method === "POST") {
    // Create a new question
    const { texte_question, quiz_id, Reponses } = req.body;
    const question = await prisma.question.create({
      data: {
        texte_question,
        quiz_id,
        Reponses: {
          create: Reponses,
        },
      },
    });
    res.status(201).json(question);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
