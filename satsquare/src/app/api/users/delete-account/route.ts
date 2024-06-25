// pages/api/users/delete-account.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
export async function DELETE(req: Request) {
 
  const { email } = await req.json();
  console.log("Email:", email);
 

 
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.utilisateur.delete({
      where: { email },
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
