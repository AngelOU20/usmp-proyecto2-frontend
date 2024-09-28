import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint para obtener estudiantes con sus datos
export async function GET (req: NextRequest) {
  try {
    // Consulta a la base de datos para traer estudiantes con sus mentores y usuarios
    const students = await prisma.student.findMany({
      include: {
        user: true, // Relación con la tabla User para obtener nombre, email, etc.
        mentor: {
          include: {
            user: true, // Relación para obtener el nombre del mentor
          },
        },
      },
    });

    // Mapear los datos para que coincidan con lo que espera la tabla
    const studentData = students.map((student) => ({
      id: student.user.id,
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone || "No disponible", // Si no tiene número, mostrar "No disponible"
      registrationNumber: student.registrationNumber,
      group: student.group,
      mentor: student.mentor?.user.name || "Sin Asesor", // Si no tiene mentor, mostrar "Sin Asesor"
      status: "Activo", // Puedes manejar el estado como un valor constante o dinámico
    }));

    // Retornar los datos en formato JSON
    return NextResponse.json({ data: studentData });
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    return NextResponse.json({ error: "Error al obtener los estudiantes" }, { status: 500 });
  }
}

export async function DELETE (req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');

  if (!studentId) {
    return NextResponse.json({ error: "Falta el ID del estudiante" }, { status: 400 });
  }

  try {
    await prisma.student.delete({
      where: {
        userId: studentId,
      }
    });

    await prisma.user.update({
      where: {
        id: studentId,
      },
      data: {
        roleId: 1,
      }
    });

    return NextResponse.json({ message: "Estudiante eliminado y roleId actualizado a 1" });
  } catch (error) {

  }

}
