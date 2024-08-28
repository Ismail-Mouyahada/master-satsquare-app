import prisma from '@/db/prisma';
import { NextResponse } from 'next/server';

 
// GET /score - Get all scores
export async function GET() {
  const subjects = await prisma.topScore.findMany();
  return NextResponse.json(subjects);
}

 