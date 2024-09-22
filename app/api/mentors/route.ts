import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET (request: Request) {
  const mentors = await prisma.mentor.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: true, // Incluye los datos de la tabla user relacionados con cada mentor
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
  const mentorId = searchParams.get('id'); // Suponemos que pasas el ID del mentor por la URL

  if (!mentorId) {
    return NextResponse.json({ error: "Falta el ID del mentor" }, { status: 400 });
  }

  try {
    // Primero eliminamos la relación en la tabla mentor
    await prisma.mentor.delete({
      where: {
        userId: mentorId, // Aquí ya no necesitas parseInt, mentorId es string
      },
    });

    // Luego actualizamos el roleId a 1 en la tabla user
    await prisma.user.update({
      where: {
        id: mentorId, // Aquí también se usa el mentorId como string
      },
      data: {
        roleId: 1, // Cambiamos a roleId 1 (usuario libre o sin rol)
      },
    });

    return NextResponse.json({ message: "Mentor eliminado y roleId actualizado a 1" });
  } catch (error) {
    console.error("Error al eliminar mentor o actualizar el roleId:", error);
    return NextResponse.json({ error: "Error al eliminar mentor o actualizar roleId" }, { status: 500 });
  }
}