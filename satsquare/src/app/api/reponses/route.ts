import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/db/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all reponses
    const reponses = await prisma.reponse.findMany();
    res.status(200).json(reponses);
  } else if (req.method === 'POST') {
    // Create a new reponse
    const { texte_reponse, est_correcte, question_id } = req.body;
    const reponse = await prisma.reponse.create({
      data: {
        texte_reponse,
        est_correcte,
        question_id,
      },
    });
    res.status(201).json(reponse);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
