import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/db/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get question by id
    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      include: {
        Reponses: true,
      },
    });
    res.status(200).json(question);
  } else if (req.method === 'PUT') {
    // Update question by id
    const { texte_question, Reponses } = req.body;
    const question = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        texte_question,
        Reponses: {
          deleteMany: {}, // Delete existing reponses
          create: Reponses, // Create new reponses
        },
      },
    });
    res.status(200).json(question);
  } else if (req.method === 'DELETE') {
    // Delete question by id
    await prisma.question.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
