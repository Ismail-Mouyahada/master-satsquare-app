import prisma from '@/db/connect';
import { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get quiz by id
    const quiz = await prisma.quiz.findUnique({
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
    res.status(200).json(quiz);
  } else if (req.method === 'PUT') {
    // Update quiz by id
    const { titre, categorie, questions } = req.body;
    const quiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: {
        titre,
        categorie,
        Questions: {
          deleteMany: {}, // delete existing questions
          create: questions, // create new questions
        },
      },
    });
    res.status(200).json(quiz);
  } else if (req.method === 'DELETE') {
    // Delete quiz by id
    await prisma.quiz.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
