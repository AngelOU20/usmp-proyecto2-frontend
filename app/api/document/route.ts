import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Función para convertir el archivo a un buffer
async function convertToBuffer (file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST (req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const documentType = formData.get("documentType") as string;
  let groupId = formData.get("groupId") as string | null;
  const email = formData.get("email") as string;
  const replace = formData.get("replace") as string;

  if (!file || !documentType || !email) {
    return NextResponse.json({ error: "Falta archivo, tipo de documento o usuario" }, { status: 400 });
  }

  try {
    // Buscar el userId y verificar si es estudiante
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true }, // Incluye la relación con estudiante
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 400 });
    }

    const isStudent = user.student !== null;

    // Si el usuario es estudiante, obtener el groupId del estudiante
    if (isStudent) {
      if (!user.student?.groupId) {
        return NextResponse.json({ error: "El estudiante no está asignado a un grupo" }, { status: 400 });
      }
      // Asignar el groupId del estudiante
      groupId = String(user.student.groupId);
    }

    // Si es asesor o rol 4, el groupId debe ser obligatorio
    if (!groupId && !isStudent) {
      return NextResponse.json({ error: "Falta el grupo para el asesor o autoridad" }, { status: 400 });
    }

    const buffer = await convertToBuffer(file);

    // Buscar el tipo de documento por nombre
    const documentTypeId = await prisma.documentType.findFirst({
      where: { name: documentType },
    });

    if (!documentTypeId) {
      return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
    }

    // Verificar si ya existe un documento con el mismo nombre en ese grupo
    const existingDocument = await prisma.document.findFirst({
      where: {
        name: file.name,
        typeId: documentTypeId.id,
        groupId: Number(groupId),
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

    // Guardar el archivo con el grupo y el usuario que lo sube
    const document = await prisma.document.create({
      data: {
        name: file.name,
        typeId: documentTypeId.id,
        size: file.size,
        content: buffer,
        userId: user.id,        // Quién sube el documento
        groupId: Number(groupId), // Relación con el grupo
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

  console.log("Viendo la sesion", session);

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
    }));

    // Retornar los documentos mapeados
    return NextResponse.json({ documents: mappedDocuments });
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return NextResponse.json({ error: "Error al obtener los documentos" }, { status: 500 });
  }
}

// Obtener documentos para el estudiante (solo los de su grupo)
async function getDocumentsForStudent (email: string) {
  const student = await prisma.student.findFirst({
    where: {
      user: { email: email },
    },
    select: {
      groupId: true,
    },
  });

  if (!student || !student.groupId) {
    throw new Error("No se encontró el estudiante o no tiene un grupo asignado.");
  }

  const documents = await prisma.document.findMany({
    where: {
      groupId: student.groupId,
    },
    include: {
      documentType: true,
    },
  });

  return documents;
}

// Obtener documentos para el mentor (solo los de los grupos asignados)
async function getDocumentsForMentor (email: string) {
  const mentor = await prisma.mentor.findFirst({
    where: {
      user: { email: email },
    },
    include: {
      groups: true,
    },
  });

  if (!mentor || mentor.groups.length === 0) {
    throw new Error("No se encontraron grupos para el asesor");
  }

  const groupIds = mentor.groups.map(group => group.id);

  const documents = await prisma.document.findMany({
    where: {
      groupId: { in: groupIds },
    },
    include: {
      documentType: true,
    },
  });

  return documents;
}

// Obtener documentos para los usuarios de rol 4 (ver todos los documentos)
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