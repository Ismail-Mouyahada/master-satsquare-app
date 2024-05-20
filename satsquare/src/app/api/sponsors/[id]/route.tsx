import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/connect';

// PUT: Mettre à jour un sponsor existant
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedSponsor = await prisma.sponsor.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedSponsor, { status: 200 });
  } catch (error) {
    console.error("Error updating sponsor:", error);
    return NextResponse.json({ error: "An error occurred while updating the sponsor" }, { status: 500 });
  }
}

// DELETE: Supprimer un sponsor existant
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.sponsor.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Sponsor deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    return NextResponse.json({ error: "An error occurred while deleting the sponsor" }, { status: 500 });
  }
}
