import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";

async function convertToBuffer (file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST (req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const documentType = formData.get("documentType") as string;
  const replace = formData.get("replace") as string;

  if (!file || !documentType) {
    return NextResponse.json({ error: "Archivo o tipo de documento no proporcionado" }, { status: 400 });
  }

  try {
    const buffer = await convertToBuffer(file);

    // Buscar el tipo de documento por nombre
    const documentTypeId = await prisma.documentType.findFirst({
      where: { name: documentType },
    });

    if (!documentTypeId) {
      return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
    }

    // Verificar si ya existe un documento con el mismo nombre
    const existingDocument = await prisma.document.findFirst({
      where: {
        name: file.name,
        typeId: documentTypeId.id,
      },
    });

    if (existingDocument && !replace) {
      // El archivo ya existe y no se indicó reemplazo
      return NextResponse.json({
        error: "Archivo ya existente",
        message: "El archivo ya existe. ¿Deseas reemplazarlo?",
        replace: true // Indicamos al frontend que se puede hacer reemplazo
      }, { status: 409 });
    }

    if (existingDocument && replace) {
      // Si se permite reemplazo, eliminamos el archivo existente
      await prisma.document.delete({
        where: { id: existingDocument.id },
      });
    }

    // Guardar el archivo en la base de datos
    const document = await prisma.document.create({
      data: {
        name: file.name,
        typeId: documentTypeId.id,
        size: file.size,
        content: buffer,
      },
    });

    return NextResponse.json({ message: "Documento subido exitosamente", document });
  } catch (error) {
    console.error("Error al subir el documento:", error);
    return NextResponse.json({ error: "Error al subir el documento" }, { status: 500 });
  }
}

// GET: Obtener lista de documentos
export async function GET () {
  try {
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        name: true,
        size: true,
        uploadDate: true,
        documentType: {
          select: { name: true },
        },
      },
    });

    // Mapeo de la data
    const mappedDocuments = documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      uploadDate: doc.uploadDate,
      type: doc.documentType.name,
    }));


    return NextResponse.json({ documents: mappedDocuments });
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 });
  }
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