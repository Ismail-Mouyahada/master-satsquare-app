import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/connect';

// PUT: Mettre à jour un événement existant
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await req.json();
    const updatedEvent = await prisma.evenement.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "An error occurred while updating the event" }, { status: 500 });
  }
}

// DELETE: Supprimer un événement existant
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.evenement.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "An error occurred while deleting the event" }, { status: 500 });
  }
}
