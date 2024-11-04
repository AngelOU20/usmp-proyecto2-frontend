import csv from 'csv-parser';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Readable } from 'stream';

// Define la estructura de los datos que esperas en el CSV
const CsvSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Función para actualizar el rol de usuario
const updateUserRole = async (email: string) => {
  return prisma.user.update({
    where: { email },
    data: { roleId: 3 },
  });
};

// Función para reactivar un mentor inactivo
const reactivateMentor = async (userId: string) => {
  return prisma.mentor.update({
    where: { userId },
    data: { isActive: true },
  });
};

// Función para crear un nuevo mentor y usuario
const createNewMentor = async (data: z.infer<typeof CsvSchema>) => {
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      roleId: 3,
    },
  });
  return prisma.mentor.create({
    data: { userId: newUser.id, isActive: true },
  });
};

// Función para insertar o actualizar mentores en la base de datos
const insertOrUpdateMentor = async (data: z.infer<typeof CsvSchema>) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!existingUser) return createNewMentor(data);

  await updateUserRole(data.email);

  const existingMentor = await prisma.mentor.findUnique({
    where: { userId: existingUser.id },
  });

  if (existingMentor && !existingMentor.isActive) {
    return reactivateMentor(existingUser.id);
  } else if (!existingMentor) {
    return prisma.mentor.create({
      data: { userId: existingUser.id, isActive: true },
    });
  }
};

export async function POST (req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer.toString());
  const results: z.infer<typeof CsvSchema>[] = [];
  const parser = stream.pipe(csv());

  for await (const row of parser) {
    try {
      const data = CsvSchema.parse({ name: row.nombre, email: row.correo });
      results.push(data);
    } catch (error) {
      console.error('Error al validar los datos:', error);
    }
  }

  for (const data of results) {
    await insertOrUpdateMentor(data);
  }

  return NextResponse.json({ message: 'Mentores cargados exitosamente' });
}
