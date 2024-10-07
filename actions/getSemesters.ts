"use server";

import { prisma } from "@/lib/prisma";

export async function getSemesters () {
  try {
    const semesters = await prisma.semester.findMany();
    return semesters;
  } catch (error) {
    throw new Error("Error al obtener los tipos de documentos");
  }
}
