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
