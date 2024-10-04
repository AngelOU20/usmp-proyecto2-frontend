import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Función para convertir el archivo a un buffer
async function convertToBuffer (file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Método Post
export async function POST (req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const documentType = formData.get("documentType") as string;
  const email = formData.get("email") as string;
  const replace = formData.get("replace") as string;
  let groupId = formData.get("groupId") as string | null;
  let subjectId: number | null = null;
  let semesterId: number | null = null;
  let isGlobal = false; // Por defecto no es global

  if (!file || !documentType || !email) {
    return NextResponse.json({ error: "Falta archivo, tipo de documento o usuario" }, { status: 400 });
  }

  try {
    // Buscar el userId por el email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 400 });
    }

    // Validación para estudiantes (roleId = 2)
    if (user.roleId === 2) {
      const student = await prisma.student.findFirst({
        where: { userId: user.id },
        include: { group: { include: { subject: true, semester: true } } },
      });

      if (!student || !student.group) {
        return NextResponse.json({ error: "Grupo no encontrado para el estudiante" }, { status: 400 });
      }

      subjectId = student.group.subjectId;
      semesterId = student.group.semesterId;
      groupId = String(student.groupId);
    }

    // Validación para asesores (roleId = 3)
    if (user.roleId === 3 && groupId) {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: { subject: true, semester: true },
      });

      if (!group) {
        return NextResponse.json({ error: "Grupo no encontrado para el asesor" }, { status: 400 });
      }

      subjectId = group.subjectId;
      semesterId = group.semesterId;
    }

    // Validación para autoridades (roleId = 4)
    if (user.roleId === 4) {
      subjectId = parseInt(formData.get("subjectId") as string, 10);
      semesterId = parseInt(formData.get("semesterId") as string, 10);
      isGlobal = true; // Si es autoridad, el archivo es global

      if (!subjectId || !semesterId || isNaN(subjectId) || isNaN(semesterId)) {
        return NextResponse.json({ error: "Asignatura o semestre no válido o no seleccionado" }, { status: 400 });
      }
    }

    const buffer = await convertToBuffer(file);

    // Buscar el tipo de documento por nombre
    const documentTypeId = await prisma.documentType.findFirst({
      where: { name: documentType },
    });

    if (!documentTypeId) {
      return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
    }

    // Verificar si ya existe un documento con el mismo nombre en ese grupo/asignatura/semestre
    const existingDocument = await prisma.document.findFirst({
      where: {
        name: file.name,
        typeId: documentTypeId.id,
        ...(groupId ? { groupId: Number(groupId) } : {}),  // Solo incluir si groupId existe
        ...(subjectId ? { subjectId: Number(subjectId) } : {}),  // Solo incluir si subjectId existe
        ...(semesterId ? { semesterId: Number(semesterId) } : {}),  // Solo incluir si semesterId existe
        isGlobal,  // Este siempre estará presente porque tiene un valor por defecto
      },
    });

    if (existingDocument && !replace) {
      return NextResponse.json({
        error: "Archivo ya existente",
        message: "El archivo ya existe. ¿Deseas reemplazarlo?",
        replace: true,
      }, { status: 409 });
    }

    if (existingDocument && replace) {
      await prisma.document.delete({
        where: { id: existingDocument.id },
      });
    }

    // Guardar el archivo con el grupo, asignatura, semestre, globalidad, y el usuario que lo sube
    const document = await prisma.document.create({
      data: {
        name: file.name,
        typeId: documentTypeId.id,
        size: file.size,
        content: buffer,
        userId: user.id,
        groupId: groupId ? Number(groupId) : null,
        subjectId: subjectId ? Number(subjectId) : null,
        semesterId: semesterId ? Number(semesterId) : null,
        isGlobal, // Indicamos si es un documento global
      },
    });

    return NextResponse.json({ message: "Documento subido exitosamente", document });
  } catch (error) {
    console.error("Error al subir el documento:", error);
    return NextResponse.json({ error: "Error al subir el documento" }, { status: 500 });
  }
}

// GET: Obtener lista de documentos
export async function GET (req: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { email, roleId } = session.user;

  if (typeof roleId !== "number") {
    return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
  }

  try {
    // Mapa de funciones por rol
    const roleActions: Record<number, (email: string) => Promise<any[]>> = {
      2: getDocumentsForStudent,  // Estudiante
      3: getDocumentsForMentor,   // Asesor
      4: getDocumentsForRoleAuthority,  // Usuario rol 4 (ver todos los documentos)
    };

    // Verifica si existe una función asociada al roleId del usuario
    const action = roleActions[roleId];

    if (!action) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: "Correo electrónico no disponible" }, { status: 400 });
    }

    // Ejecuta la función asociada al rol
    const documents = await action(email);

    // Mapeo de la data
    const mappedDocuments = documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      uploadDate: doc.uploadDate,
      type: doc.documentType.name,
      isGlobal: doc.isGlobal,
    }));

    // Retornar los documentos mapeados
    return NextResponse.json({ documents: mappedDocuments });
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return NextResponse.json({ error: "Error al obtener los documentos" }, { status: 500 });
  }
}

// Obtener documentos para el estudiante (grupo y globales)
async function getDocumentsForStudent (email: string) {
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
        },
      },
    },
  });

  if (!student || !student.groupId || !student.group) {
    throw new Error("No se encontró el estudiante o no tiene un grupo asignado.");
  }

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { groupId: student.groupId },  // Documentos del grupo
        {
          isGlobal: true,  // Documentos globales
          subjectId: student.group.subjectId,
          semesterId: student.group.semesterId,
        },
      ],
    },
    include: {
      documentType: true,
    },
  });

  return documents;
}

// Obtener documentos para el mentor (grupos asignados y globales)
async function getDocumentsForMentor (email: string) {
  const mentor = await prisma.mentor.findFirst({
    where: {
      user: { email: email },
    },
    include: {
      groups: {
        select: {
          id: true,
          subjectId: true,
          semesterId: true,
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

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { groupId: { in: groupIds } },  // Documentos de los grupos del asesor
        {
          isGlobal: true,  // Documentos globales
          subjectId: { in: subjectIds },
          semesterId: { in: semesterIds },
        },
      ],
    },
    include: {
      documentType: true,
    },
  });

  return documents;
}

// Obtener documentos para las autoridades (todos los documentos)
async function getDocumentsForRoleAuthority () {
  const documents = await prisma.document.findMany({
    include: {
      documentType: true,
    },
  });

  return documents;
}


// DELETE: Eliminar un documento por ID
export async function DELETE (req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    // Eliminar el documento por ID
    const deletedDocument = await prisma.document.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Documento eliminado exitosamente", deletedDocument });
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    return NextResponse.json({ error: "Error al eliminar el documento" }, { status: 500 });
  }
}