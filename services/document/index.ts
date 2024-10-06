import { prisma } from "@/lib/prisma";

// Obtener el tipo de documento por nombre
export async function getDocumentTypeByName (name: string) {
  return prisma.documentType.findFirst({
    where: { name },
  });
}

// Buscar si ya existe un documento con el mismo nombre
export async function findExistingDocument (name: string, typeId: number, groupId?: number, subjectId?: number, semesterId?: number, isGlobal = false) {
  return prisma.document.findFirst({
    where: {
      name,
      typeId,
      ...(groupId ? { groupId } : {}),
      ...(subjectId ? { subjectId } : {}),
      ...(semesterId ? { semesterId } : {}),
      isGlobal,
    },
  });
}

// Crear un documento
export async function createDocument (data: {
  name: string;
  typeId: number;
  size: number;
  content: Buffer;
  userId: string;
  groupId: number | null;
  subjectId: number | null;
  semesterId: number | null;
  isGlobal: boolean;
}) {
  return prisma.document.create({ data });
}

// Eliminar un documento por ID
export async function deleteDocumentById (id: number) {
  return prisma.document.delete({
    where: { id },
  });
}

// Obtener documentos para estudiantes
export async function getDocumentsForStudent (email: string) {
  const student = await prisma.student.findFirst({
    where: {
      user: { email: email },
    },
    select: {
      groupId: true,
      group: {
        select: {
          subjectId: true,
          semesterId: true,
          subject: { select: { name: true } },
          semester: { select: { name: true } },
        },
      },
    },
  });

  if (!student || !student.groupId || !student.group) {
    throw new Error("No se encontró el estudiante o no tiene un grupo asignado.");
  }

  return prisma.document.findMany({
    where: {
      OR: [
        { groupId: student.groupId },
        {
          isGlobal: true,
          subjectId: student.group.subjectId,
          semesterId: student.group.semesterId,
        },
      ],
    },
    include: {
      documentType: true,
      subject: { select: { name: true } },
      semester: { select: { name: true } },
      group: {
        select: {
          name: true,
          subject: { select: { name: true } },
          semester: { select: { name: true } },
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
}

// Obtener documentos para asesores
export async function getDocumentsForMentor (email: string) {
  const mentor = await prisma.mentor.findFirst({
    where: {
      user: { email: email },
    },
    include: {
      groups: {
        select: {
          id: true,
          name: true,
          subjectId: true,
          semesterId: true,
          subject: { select: { name: true } },
          semester: { select: { name: true } },
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

  if (!mentor || mentor.groups.length === 0) {
    throw new Error("No se encontraron grupos para el asesor");
  }

  const groupIds = mentor.groups.map(group => group.id);
  const subjectIds = mentor.groups.map(group => group.subjectId);
  const semesterIds = mentor.groups.map(group => group.semesterId);

  return prisma.document.findMany({
    where: {
      OR: [
        { groupId: { in: groupIds } },
        {
          isGlobal: true,
          subjectId: { in: subjectIds },
          semesterId: { in: semesterIds },
        },
      ],
    },
    include: {
      documentType: true,
      subject: { select: { name: true } },
      semester: { select: { name: true } },
      group: {
        select: {
          name: true,
          subject: { select: { name: true } },
          semester: { select: { name: true } },
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
}

// Obtener todos los documentos para autoridades
export async function getDocumentsForRoleAuthority () {
  return prisma.document.findMany({
    include: {
      documentType: true,
      subject: { select: { name: true } },
      semester: { select: { name: true } },
      group: {
        select: {
          name: true,
          subject: { select: { name: true } },
          semester: { select: { name: true } },
          students: {
            select: {
              user: {
                select: {
                  name: true
                },
              },
            },
          },
        },
      },
    },
  });
}
