"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/spinner";
import { getColumns } from "./document-table-columns";
import { DocumentsTable } from "./document-table";
import { Document } from "./document.type";
import { toast } from "@/hooks/use-toast";

export const ListDocuments = () => {
  const [documentData, setdocumentData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/document?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el documento");
      }

      // Actualizar la lista de documentos eliminando el documento localmente
      setdocumentData((prevData) => prevData.filter((doc) => doc.id !== id));

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
      try {
        const response = await fetch("/api/document");
        if (!response.ok) {
          throw new Error("Error fetching documents");
        }
        const data = await response.json();

        setdocumentData(data.documents);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar los documentos");
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* <pre>{JSON.stringify(documentData, null, 2)}</pre> */}
      <DocumentsTable columns={columns} data={documentData} />
    </>
  );
};
