"use server";

import { prisma } from "@/lib/prisma";

export async function getDocumentTypes () {
  try {
    const documentTypes = await prisma.documentType.findMany();
    return documentTypes;
  } catch (error) {
    throw new Error("Error al obtener los tipos de documentos");
  }
}
