import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

<<<<<<< HEAD
// GET: Fetch all reponses
=======
// GET: Retrieve all responses
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
export async function GET(req: NextRequest) {
  try {
    const reponses = await prisma.reponse.findMany();
    return NextResponse.json(reponses, { status: 200 });
  } catch (error) {
<<<<<<< HEAD
    console.error("Error fetching reponses:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the reponses" },
=======
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching responses" },
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
      { status: 500 }
    );
  }
}

<<<<<<< HEAD
// POST: Create a new reponse
=======
// POST: Create a new response
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { texte_reponse, est_correcte, question_id } = data;
<<<<<<< HEAD
    
=======
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
    const reponse = await prisma.reponse.create({
      data: {
        texte_reponse,
        est_correcte,
        question_id,
      },
    });
<<<<<<< HEAD
    
    return NextResponse.json(reponse, { status: 201 });
  } catch (error) {
    console.error("Error creating reponse:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the reponse" },
=======
    return NextResponse.json(reponse, { status: 201 });
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the response" },
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
      { status: 500 }
    );
  }
}
