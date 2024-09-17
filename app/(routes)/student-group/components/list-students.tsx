"use client";

import React, { useEffect, useState } from "react";
import { StudentTable } from "./student-table";
import { Spinner } from "@/components/spinner";
import { getColumns } from "./student-table-columns";
import { Student } from "./student.type";

export const ListStudents = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores (opcional)
  const columns = React.useMemo(() => getColumns(), []);

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true); // Comienza la carga
      try {
        const response = await fetch("/api/student");
        if (!response.ok) {
          throw new Error("Error fetching mentors");
        }
        const data = await response.json();
        setStudentData(data.data);
        setIsLoading(false); // Finaliza la carga
      } catch (error) {
        setError("Error al cargar mentores"); // En caso de error
        setIsLoading(false);
      }
    };

    fetchMentors();
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
