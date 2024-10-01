import csv from "csv-parser";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
import { Student } from "@/types/user.types";

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

  for (const student of students) {
    const { nroMatricula, nombre, correo: email, grupo, correoAsesor, titulo, semestre, asignatura } = student;

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
          phone: null,
          roleId: 2, // Rol de estudiante
        },
      });
    } else {
      // Si el usuario ya existe, solo actualiza su rol a estudiante si no lo tiene
      if (existingUser.roleId !== 2) {
        user = await prisma.user.update({
          where: { email },
          data: { roleId: 2 },
        });
      } else {
        user = existingUser;
      }
    }

    // Buscar la asignatura
    const subject = await prisma.subject.findFirst({
      where: { name: asignatura },
    });

    if (!subject) {
      console.error(`Asignatura ${asignatura} no encontrada`);
      continue;
    }

    // Buscar o crear el grupo, asignando también la asignatura
    let group = await prisma.group.findFirst({
      where: {
        name: grupo,
        subjectId: subject.id  // Verificar que el grupo sea el correcto dentro de la asignatura
      },
    });

    if (!group) {
      group = await prisma.group.create({
        data: { name: grupo, titleProject: titulo, subjectId: subject.id },
      });
    }

    if (group.titleProject !== titulo) {
      group = await prisma.group.update({
        where: { id: group.id },
        data: { titleProject: titulo },
      });
    }

    // Asignar asesor al grupo
    const mentor = await prisma.mentor.findFirst({
      where: {
        user: { email: correoAsesor },
      },
    });

    if (!mentor) {
      console.error(`Asesor con correo ${correoAsesor} no encontrado`);
      continue;
    }

    // Verificar si ya existe la relación entre asesor y grupo
    const existingMentorGroup = await prisma.mentorGroup.findUnique({
      where: {
        mentorId_groupId: {
          mentorId: mentor.id,
          groupId: group.id,
        },
      },
    });

    if (!existingMentorGroup) {
      // Si no existe la relación, crearla
      await prisma.mentorGroup.create({
        data: {
          mentorId: mentor.id,
          groupId: group.id,
        },
      });
    } else {
      console.log(`La relación entre el mentor y el grupo ya existe.`);
    }

    console.log(`Número de matrícula: ${nroMatricula}`);

    // Verificar si el estudiante ya existe en la tabla Student
    const existingStudent = await prisma.student.findUnique({
      where: { userId: user.id },
    });

    if (!existingStudent) {
      // Crear el registro en la tabla Student solo si no existe
      await prisma.student.create({
        data: {
          userId: user.id,
          groupId: group.id,
          subjectId: subject.id, // Vincular el estudiante con la asignatura
          registrationNumber: nroMatricula,
          semester: semestre,
        },
      });
    } else {
      console.log(`El estudiante con userId ${user.id} ya existe.`);
    }
  }

  return NextResponse.json({ message: "Archivo subido y procesado con éxito" });
}
