import csv from "csv-parser";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
import { Student } from "@/types/student";

export async function POST (req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Archivo no proporcionado" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer.toString());

  const students: Student[] = [];

  // Procesar el CSV usando promesas
  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // Procesar cada estudiante después de que el stream termine
  for (const student of students) {
    const { email, nombre, grupo, nroMatricula, titulo, correoMentor } = student;

    // Valida si el email del estudiante está presente
    if (!email) {
      console.error('El email no está definido para este estudiante:', student);
      continue;
    }

    // Buscar si el usuario (estudiante) ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Lógica para crear o actualizar el usuario si no existe
    let user;
    if (!existingUser) {
      user = await prisma.user.create({
        data: {
          email,
          name: nombre,
          phone: null, // Asigna otros campos según sea necesario
          roleId: 2, // Rol de estudiante
        },
      });
    } else {
      // Si el usuario ya existe, solo actualiza su rol a estudiante si no lo tiene
      if (existingUser.roleId !== 2) {
        user = await prisma.user.update({
          where: { email },
          data: {
            roleId: 2, // Rol de estudiante
          },
        });
      } else {
        user = existingUser;
      }
    }

    // Buscar el mentor asociado con el correo
    const mentor = await prisma.mentor.findFirst({
      where: {
        user: {
          email: correoMentor, // Cambio de búsqueda por el correo del mentor
        },
      },
    });

    if (!mentor) {
      console.error(`Mentor con correo ${correoMentor} no encontrado`);
      continue;
    }

    // Crear el registro en la tabla Student
    await prisma.student.create({
      data: {
        userId: user.id,
        mentorId: mentor.id,
        group: grupo,
        registrationNumber: nroMatricula,
        titleProject: titulo,
      },
    });
  }

  return NextResponse.json({ message: "Archivo subido y procesado con éxito" });
}
