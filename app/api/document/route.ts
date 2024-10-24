import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convertToBuffer } from "@/lib/utils";
import { getDocumentTypeByName, findExistingDocument, createDocument, deleteDocumentById, getDocumentsForStudent, getDocumentsForMentor, getDocumentsForRoleAuthority } from "@/services/document";
import { prisma } from "@/lib/prisma";
import { saveOnPinecone } from "@/services/pinecone";

// POST: Subir un documento
export async function POST (req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const documentType = formData.get("documentType") as string;
  const email = formData.get("email") as string;
  const replace = formData.get("replace") as string;
  let groupId = formData.get("groupId") as string | null;
  let subjectId: number | null = null;
  let semesterId: number | null = null;
  let isGlobal = false;

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

    if (user.roleId === 4) {
      subjectId = parseInt(formData.get("subjectId") as string, 10);
      semesterId = parseInt(formData.get("semesterId") as string, 10);
      isGlobal = true;

      if (!subjectId || !semesterId || isNaN(subjectId) || isNaN(semesterId)) {
        return NextResponse.json({ error: "Asignatura o semestre no válido o no seleccionado" }, { status: 400 });
      }
    }

    const buffer = await convertToBuffer(file);
    const documentTypeId = await getDocumentTypeByName(documentType);

    if (!documentTypeId) {
      return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
    }

    const existingDocument = await findExistingDocument(
      file.name,
      documentTypeId.id,
      groupId ? Number(groupId) : undefined,
      subjectId ? Number(subjectId) : undefined,
      semesterId ? Number(semesterId) : undefined,
      isGlobal
    );

    if (existingDocument && !replace) {
      return NextResponse.json({
        error: "Archivo ya existente",
        message: "El archivo ya existe. ¿Deseas reemplazarlo?",
        replace: true,
      }, { status: 409 });
    }

    if (existingDocument && replace) {
      await deleteDocumentById(existingDocument.id);
    }

    const document = await createDocument({
      name: file.name,
      typeId: documentTypeId.id,
      size: file.size,
      content: buffer,
      userId: user.id,
      groupId: groupId ? Number(groupId) : null,
      subjectId: subjectId ? Number(subjectId) : null,
      semesterId: semesterId ? Number(semesterId) : null,
      isGlobal
    });

    await saveOnPinecone([file]);

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
    const roleActions: Record<number, (email: string) => Promise<any[]>> = {
      2: getDocumentsForStudent,
      3: getDocumentsForMentor,
      4: getDocumentsForRoleAuthority,
    };

    const action = roleActions[roleId];
    if (!action) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: "Correo electrónico no disponible" }, { status: 400 });
    }

    const documents = await action(email);
    const mappedDocuments = documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      uploadDate: doc.uploadDate,
      type: doc.documentType.name,
      isGlobal: doc.isGlobal,
      groupName: doc.group ? doc.group.name : "Sin grupo",
      subjectName: doc.isGlobal ? doc.subject?.name : doc.group?.subject?.name || "Sin asignatura",
      semesterName: doc.isGlobal ? doc.semester?.name : doc.group?.semester?.name || "Sin semestre",
      students: doc.group ? doc.group.students.map((student: { user: { name: string; }; }) => student.user.name) : [],
    }));

    return NextResponse.json({ documents: mappedDocuments });
  } catch (error: any) {
    console.error("Error al obtener documentos:", error);

    // Manejamos el error específico cuando no se encontraron grupos
    if (error.message === "No se encontraron grupos para el asesor") {
      return NextResponse.json({ error: "No se encontraron grupos para el asesor" }, { status: 404 });
    }

    // Otros errores generales
    return NextResponse.json({ error: "Error al obtener los documentos" }, { status: 500 });
  }
}

// DELETE: Eliminar un documento
export async function DELETE (req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const deletedDocument = await deleteDocumentById(Number(id));
    return NextResponse.json({ message: "Documento eliminado exitosamente", deletedDocument });
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    return NextResponse.json({ error: "Error al eliminar el documento" }, { status: 500 });
  }
}
