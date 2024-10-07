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

    // Validar si el email del estudiante está presente
    if (!email) {
      console.error('El email no está definido para este estudiante:', student);
      continue;
    }

    // Buscar o crear el semestre
    let semester = await prisma.semester.findFirst({
      where: { name: semestre },
    });

    if (!semester) {
      semester = await prisma.semester.create({
        data: { name: semestre },
      });
    }

    // Buscar si el usuario (estudiante) ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (!existingUser) {
      // Crear un nuevo usuario si no existe
      user = await prisma.user.create({
        data: {
          email,
          name: nombre,
          phone: null,
          roleId: 2, // Rol de estudiante
        },
      });
    } else {
      // Si el usuario ya existe, actualizar su rol a estudiante si no lo tiene
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

    // Buscar o crear el grupo, asignando también la asignatura y semestre
    let group = await prisma.group.findFirst({
      where: {
        name: grupo,
        subjectId: subject.id,
        semesterId: semester.id, // Validar el grupo en el semestre correcto
      },
    });

    if (!group) {
      group = await prisma.group.create({
        data: { name: grupo, titleProject: titulo, subjectId: subject.id, semesterId: semester.id },
      });
    }

    // Asignar el asesor al grupo si no tiene uno
    const mentor = await prisma.mentor.findFirst({
      where: {
        user: { email: correoAsesor },
      },
    });

    if (!mentor) {
      console.error(`Asesor con correo ${correoAsesor} no encontrado`);
      continue;
    }

    // Verificar si el grupo ya tiene un mentor asignado
    if (!group.mentorId) {
      await prisma.group.update({
        where: { id: group.id },
        data: { mentorId: mentor.id },
      });
    } else {
      console.log(`El grupo ${grupo} ya tiene un mentor asignado.`);
    }

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
          semesterId: semester.id, // Vincular el estudiante con el semestre
          registrationNumber: nroMatricula,
        },
      });
    } else {
      console.log(`El estudiante con userId ${user.id} ya existe.`);
    }
  }

  return NextResponse.json({ message: "Archivo subido y procesado con éxito" });
}
