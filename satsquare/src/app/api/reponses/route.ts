import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

// GET: Retrieve all responses
export async function GET(req: NextRequest) {
  try {
    const reponses = await prisma.reponse.findMany();
    return NextResponse.json(reponses, { status: 200 });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching responses" },
      { status: 500 }
    );
  }
}

// POST: Create a new response
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { texte_reponse, est_correcte, question_id } = data;
    const reponse = await prisma.reponse.create({
      data: {
        texte_reponse,
        est_correcte,
        question_id,
      },
    });
    return NextResponse.json(reponse, { status: 201 });
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the response" },
      { status: 500 }
    );
  }
}
