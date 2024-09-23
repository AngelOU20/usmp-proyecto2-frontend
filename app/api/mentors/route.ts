import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET (request: Request) {
  const mentors = await prisma.mentor.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: true, // Incluye los datos de la tabla user relacionados con cada asesor
    },
  });

  const mappedMentors = mentors.map((mentor) => ({
    id: mentor.user.id,
    name: mentor.user.name,
    email: mentor.user.email,
    phone: mentor.user.phone || "No disponible",
  }));

  return NextResponse.json({ mentors: mappedMentors });
}

export async function DELETE (request: Request) {
  const { searchParams } = new URL(request.url);
  const mentorId = searchParams.get('id'); // ID del asesor por la URL

  if (!mentorId) {
    return NextResponse.json({ error: "Falta el ID del asesor" }, { status: 400 });
  }

  try {
    await prisma.mentor.delete({
      where: {
        userId: mentorId,
      },
    });

    await prisma.user.update({
      where: {
        id: mentorId,
      },
      data: {
        roleId: 1,
      },
    });

    return NextResponse.json({ message: "Asesor eliminado y roleId actualizado a 1" });
  } catch (error) {
    console.error("Error al eliminar asesor o actualizar el roleId:", error);
    return NextResponse.json({ error: "Error al eliminar asesor o actualizar roleId" }, { status: 500 });
  }
}