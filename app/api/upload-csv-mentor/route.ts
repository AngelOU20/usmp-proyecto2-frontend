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

// Valida la información y la inserta en la base de datos
const insertMentorToDB = async (data: z.infer<typeof CsvSchema>) => {
  try {
    // Verifica si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Actualizar el rol del usuario a asesor si ya existe
      await prisma.user.update({
        where: { email: data.email },
        data: {
          roleId: 3, // Asigna el roleId 3 por defecto para asesores
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

    } else {
      // Si el usuario no existe, crear un nuevo usuario y su registro en la tabla mentor
      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          roleId: 3, // Asigna el roleId 3 por defecto para asesores
        },
      });

      // Crear su correspondiente registro en la tabla mentor
      await prisma.mentor.create({
        data: {
          userId: newUser.id,
        },
      });
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

  // Convierte el archivo en un stream de lectura
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer.toString());

  const results: z.infer<typeof CsvSchema>[] = [];

  const parser = stream.pipe(csv());

  const mapRowToSchema = (row: any) => ({
    name: row.nombre,   // Mapear el campo 'nombre' a 'name'
    email: row.correo   // Mapear 'correo' a 'email'
  });

  for await (const row of parser) {
    try {
      const validatedData = CsvSchema.parse(mapRowToSchema(row)); // Mapeo y validación
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
