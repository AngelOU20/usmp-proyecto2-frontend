"use server";

import { prisma } from "@/lib/prisma";

export async function getSubjects () {
  try {
    const subjects = await prisma.subject.findMany();
    return subjects;
  } catch (error) {
    throw new Error("Error al obtener los tipos de documentos");
  }
}
