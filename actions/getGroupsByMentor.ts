"use server";

import { prisma } from "@/lib/prisma";

export async function getGroupsByMentor (email: string) {
  if (!email) {
    throw new Error("El email es requerido");
  }

  // Buscar el mentor basado en el email
  const mentor = await prisma.mentor.findFirst({
    where: {
      user: {
        email: email,
      },
    },
    include: {
      groups: {
        include: {
          subject: true, // Para obtener el nombre de la asignatura
          semester: true, // Para obtener el semestre
        },
      },
    },
  });

  if (!mentor) {
    throw new Error("No se encontraron grupos para el asesor.");
  }

  // Retornamos los grupos del mentor con su asignatura y semestre
  return mentor.groups.map((group) => ({
    id: group.id,
    name: group.name,
    titleProject: group.titleProject || "Sin proyecto",
    subject: group.subject?.name || "Sin asignatura",
    semester: group.semester?.name || "Sin semestre",
  }));
}
