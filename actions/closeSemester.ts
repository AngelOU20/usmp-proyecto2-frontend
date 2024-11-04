"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function closeSemester (semester: string, subject: string) {
  await prisma.$transaction(async (prisma) => {
    // Primero, actualiza los registros de Student para desactivar el semestre
    await prisma.student.updateMany({
      where: {
        semester: { name: semester },
        subject: { name: subject },
        isActive: true,
      },
      data: { isActive: false },
    });

    // Luego, actualiza los usuarios cuyo rol debe ser cambiado a 'Agente Libre' (roleId = 1)
    await prisma.user.updateMany({
      where: {
        students: {
          some: {
            semester: { name: semester },
            subject: { name: subject },
            isActive: false,
          },
        },
      },
      data: { roleId: 1 },
    });
  });

  revalidatePath("/students-group");
}
