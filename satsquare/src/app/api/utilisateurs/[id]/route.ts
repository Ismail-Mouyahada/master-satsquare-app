import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { exclude } from "@/utils/utils";

function handleBigInt(value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await req.json();

    // Handle password hashing if the password is provided and not empty
    if (data.mot_de_passe && data.mot_de_passe.trim() !== "") {
      const saltRounds = 10;
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, saltRounds);
    } else {
      delete data.mot_de_passe;
    }

    const updateData: any = {
      pseudo: data.pseudo,
      email: data.email,
      statutCompte: data.statut_compte,
      mot_de_passe: data.mot_de_passe,
      ...(data.roleId && {
        role: {
          connect: {
            id: data.roleId,
          },
        },
      }),
    };

    const updatedUtilisateur = await prisma.utilisateur.update({
      where: { id: Number(id) },
      data: updateData,
    });

    const responseUtilisateur = exclude(updatedUtilisateur, ["mot_de_passe"]);
    const serializedResponse = JSON.parse(
      JSON.stringify(responseUtilisateur, (_, value) => handleBigInt(value))
    );

    return NextResponse.json(serializedResponse, { status: 200 });
  } catch (error) {
    console.error("Error updating utilisateur:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un utilisateur existant
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.utilisateur.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Utilisateur deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting utilisateur:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the utilisateur" },
      { status: 500 }
    );
  }
}
