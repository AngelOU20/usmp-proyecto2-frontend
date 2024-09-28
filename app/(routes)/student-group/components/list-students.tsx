"use client";

import React, { useEffect, useState } from "react";
import { StudentTable } from "./student-table";
import { Spinner } from "@/components/spinner";
import { getColumns } from "./student-table-columns";
import { Student } from "./student.type";
import { toast } from "@/hooks/use-toast";

export const ListStudents = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true); // Comienza la carga
    try {
      const response = await fetch("/api/student");
      if (!response.ok) {
        throw new Error("Error fetching students");
      }
      const data = await response.json();
      setStudentData(data.data);
      setIsLoading(false); // Finaliza la carga
    } catch (error) {
      setError("Error al cargar estudiantes"); // En caso de error
      setIsLoading(false);
    }
  };

  // Función para eliminar estudiante
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/student?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el estudiante");
      }

      // Actualizar la tabla de estudiantes localmente
      await fetchStudents();

      toast({
        title: "Estudiante eliminado",
        description: "El estudiante ha sido eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al intentar eliminar al estudiante.",
        variant: "destructive",
      });
    }
  };

  const columns = React.useMemo(() => getColumns(handleDelete), []);

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* <pre>{JSON.stringify(studentData, null, 2)}</pre> */}
      <StudentTable columns={columns} data={studentData} />
    </>
  );
};
