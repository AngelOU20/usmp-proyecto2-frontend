"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/spinner";
import { getColumns } from "./document-table-columns";
import { DocumentsTable } from "./document-table";
import { Document } from "./document.type";
import { toast } from "@/hooks/use-toast";

export const ListDocuments = () => {
  const [documentData, setDocumentData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/document?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el documento");
      }

      // Actualizar la lista de documentos eliminando el documento localmente
      setDocumentData((prevData) => prevData.filter((doc) => doc.id !== id));

      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al intentar eliminar el documento.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo(() => getColumns(handleDelete), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/document");
        const data = await response.json();

        if (response.ok) {
          setDocumentData(data.documents);
        } else {
          if (data.error === "No se encontraron grupos para el asesor") {
            setErrorMessage("No tienes grupos asignados.");
          } else {
            setErrorMessage("Hubo un error al cargar los documentos.");
          }
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        setErrorMessage("Error de conexión. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full flex justify-center items-center text-red-500">
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      <DocumentsTable columns={columns} data={documentData} />
    </>
  );
};
