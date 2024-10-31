"use server";

import { prisma } from "@/lib/prisma";

export async function getGroupsByMentor (email: string) {
  if (!email) {
    throw new Error("El email es requerido");
  }

  const mentor = await prisma.mentor.findFirst({
    where: {
      user: {
        email: email,
      },
    },
    include: {
      groups: {
        include: {
          subject: true,
          semester: true,
          students: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mentor) {
    throw new Error("No se encontraron grupos para el asesor.");
  }

  return mentor.groups.map((group) => ({
    id: group.id,
    name: group.name,
    titleProject: group.titleProject || "Sin proyecto",
    subject: group.subject?.name || "Sin asignatura",
    semester: group.semester?.name || "Sin semestre",
    students: group.students.map((student) => student.user.name),
  }));
}
