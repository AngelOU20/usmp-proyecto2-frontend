import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint para obtener estudiantes con sus datos
export async function GET (req: NextRequest) {
  try {
    // Consulta a la base de datos para traer estudiantes con sus mentores, usuarios, grupos, asignaturas y semestre
    const students = await prisma.student.findMany({
      include: {
        user: true, // Relación con la tabla User para obtener nombre, email, etc.
        group: {
          include: {
            subject: true, // Relación para obtener el nombre de la asignatura
            mentors: {
              include: {
                mentor: {
                  include: {
                    user: true, // Relación para obtener el nombre del mentor
                  },
                },
              },
            },
            semester: true, // Relación para obtener el semestre del grupo
          },
        },
        semester: true, // Relación con la tabla Semestre
      },
    });

    // Mapear los datos para que coincidan con lo que espera la tabla
    const studentData = students.map((student) => ({
      id: student.user.id,
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone || "No disponible",
      registrationNumber: student?.registrationNumber || "Sin número de matricula",
      group: student.group?.name || "Sin grupo",
      titleProject: student.group?.titleProject || "Sin proyecto",
      mentor: student.group?.mentors[0]?.mentor?.user.name || "Sin Asesor",
      subject: student.group?.subject?.name || "Sin Asignatura",
      semester: student.semester?.name || student.group?.semester?.name || "Sin semestre",
      status: "Activo",
    }));

    // Retornar los datos en formato JSON
    return NextResponse.json({ data: studentData });
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    return NextResponse.json({ error: "Error al obtener los estudiantes" }, { status: 500 });
  }
}

// Endpoint para eliminar estudiante y actualizar roleId
export async function DELETE (req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');

  if (!studentId) {
    return NextResponse.json({ error: "Falta el ID del estudiante" }, { status: 400 });
  }

  try {
    // Eliminar el registro del estudiante
    await prisma.student.delete({
      where: {
        userId: studentId,
      },
    });

    // Actualizar el roleId del usuario a '1' (asumido como 'Agente Libre')
    await prisma.user.update({
      where: {
        id: studentId,
      },
      data: {
        roleId: 1,
      },
    });

    return NextResponse.json({ message: "Estudiante eliminado y roleId actualizado a 1" });
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error);
    return NextResponse.json({ error: "Error al eliminar el estudiante" }, { status: 500 });
  }
}
