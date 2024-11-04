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
    setIsLoading(true);
    try {
      const response = await fetch("/api/student");
      if (!response.ok) {
        throw new Error("Error fetching students");
      }
      const data = await response.json();
      setStudentData(data.data);
      setIsLoading(false);
    } catch (error) {
      setError("Error al cargar estudiantes");
      setIsLoading(false);
    }
  };

  const handleDelete = async (
    id: string,
    semesterId: number,
    subjectId: number
  ) => {
    try {
      const response = await fetch(
        `/api/student?id=${id}&semesterId=${semesterId}&subjectId=${subjectId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el estudiante");
      }

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
      <StudentTable columns={columns} data={studentData} />
    </>
  );
};
