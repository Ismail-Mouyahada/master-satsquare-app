 
import prisma from '@/db/prisma';
import { NextResponse } from 'next/server';
 

// GET /score/[id] - Get a specific topScore by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const topScore = await prisma.topScore.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  if (!topScore) {
    return NextResponse.json({ error: 'topScore not found' }, { status: 404 });
  }

  return NextResponse.json(topScore);
}

// PUT /score/[id] - Update a specific topScore by ID
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const data = await request.json();

//   const updatedtopScore = await prisma.topScore.update({
//     where: {
//       id: Number(params.id),
//     },
//     data: {
//       sujet: data.name,
//       topScores: {
//         deleteMany: {}, // Delete all existing top scores
//         create: data.topScores, // Create new top scores
//       },
//     },
//   });

//   return NextResponse.json(updatedtopScore);
// }

// DELETE /score/[id] - Delete a specific topScore by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.topScore.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json({ message: 'topScore deleted' });
}
