import prisma from '@/db/connect';
import { NextApiRequest, NextApiResponse } from 'next';
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get reponse by id
    const reponse = await prisma.reponse.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(reponse);
  } else if (req.method === 'PUT') {
    // Update reponse by id
    const { texte_reponse, est_correcte } = req.body;
    const reponse = await prisma.reponse.update({
      where: { id: Number(id) },
      data: {
        texte_reponse,
        est_correcte,
      },
    });
    res.status(200).json(reponse);
  } else if (req.method === 'DELETE') {
    // Delete reponse by id
    await prisma.reponse.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
