"use client";

import { useEffect, useMemo, useState } from "react";
import { MentorTable } from "./mentor-table";
import { getColumns } from "./mentor-table-columns";
import { Spinner } from "@/components/spinner";
import { toast } from "@/hooks/use-toast";

export const ListMentors = () => {
  const [mentorData, setMentorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mentors");
      if (!response.ok) {
        throw new Error("Error fetching mentors");
      }
      const data = await response.json();
      setMentorData(data.mentors);
      setIsLoading(false);
    } catch (error) {
      setError("Error al cargar mentores");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/mentors?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el mentor");
      }

      await fetchMentors();

      toast({
        title: "Mentor eliminado",
        description: "El mentor ha sido eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al intentar eliminar el mentor.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo(() => getColumns(handleDelete), []);

  useEffect(() => {
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
