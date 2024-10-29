"use server";

import { prisma } from "@/lib/prisma";

export async function getGroups () {
  try {
    const groups = await prisma.group.findMany({
      include: {
        subject: true,
        semester: true,
      },
      orderBy: [
        {
          semester: {
            name: "asc",
          },
        },
        {
          subject: {
            name: "asc",
          },
        },
        {
          name: "asc",
        }
      ],
    });

    const sortedGroups = groups.sort((a, b) => {
      const groupNumberA = parseInt(a.name.replace(/\D/g, ''), 10);
      const groupNumberB = parseInt(b.name.replace(/\D/g, ''), 10);
      return groupNumberA - groupNumberB;
    });

    return sortedGroups.map((group) => ({
      id: group.id,
      name: group.name,
      titleProject: group.titleProject || "Sin proyecto",
      subject: group.subject?.name || "Sin asignatura",
      semester: group.semester?.name || "Sin semestre",
    }));
  } catch (error) {
    throw new Error("Error al obtener los tipos de documentos");
  }

}

