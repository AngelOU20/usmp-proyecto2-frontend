import csv from 'csv-parser';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createReadStream } from 'fs';
import { promises as fs } from 'fs';
import { z } from 'zod';

// Define la estructura de los datos que esperas en el CSV
const CsvSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  roleId: z.preprocess((val) => Number(val), z.number()) // Convierte la cadena a número antes de validarlo
});

// Valida la información y la inserta en la base de datos
const insertMentorToDB = async (data: z.infer<typeof CsvSchema>) => {
  try {
    // Verifica si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Actualizar el rol del usuario a mentor si ya existe
      await prisma.user.update({
        where: { email: data.email },
        data: {
          roleId: data.roleId,
        },
      });

      // Asegúrate de que exista el registro en la tabla mentor
      await prisma.mentor.upsert({
        where: { userId: existingUser.id },
        update: {},
        create: {
          userId: existingUser.id,
        },
      });

      // Aquí se omite la creación/actualización de la cuenta en la tabla account

    } else {
      // Si el usuario no existe, crear un nuevo usuario y su registro en la tabla mentor
      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          roleId: data.roleId,
        },
      });

      // Crear su correspondiente registro en la tabla mentor
      await prisma.mentor.create({
        data: {
          userId: newUser.id,
        },
      });

      // Aquí se omite la creación de la cuenta en la tabla account
    }
  } catch (error) {
    console.error('Error al insertar el mentor:', error);
  }
};



export async function POST (req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');

  // Crea el directorio 'uploads' si no existe
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, file.name);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const results: any[] = [];
  const parser = createReadStream(filePath).pipe(csv());

  for await (const row of parser) {
    try {
      const validatedData = CsvSchema.parse(row); // Validamos cada fila
      results.push(validatedData);
    } catch (error) {
      console.error('Error al validar los datos:', error);
    }
  }

  for (const result of results) {
    await insertMentorToDB(result);
  }

  return NextResponse.json({ message: 'Mentores cargados exitosamente' });
}
