"use client";

import { useEffect, useState } from "react";
import { MentorTable } from "./mentor-table";
import { columns } from "./mentor-table-columns";
import { Spinner } from "@/components/spinner";

export const ListMentors = () => {
  const [mentorData, setMentorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores (opcional)

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true); // Comienza la carga
      try {
        const response = await fetch("/api/mentors");
        if (!response.ok) {
          throw new Error("Error fetching mentors");
        }
        const data = await response.json();
        setMentorData(data.mentors);
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

  return <MentorTable columns={columns} data={mentorData} />;
};
