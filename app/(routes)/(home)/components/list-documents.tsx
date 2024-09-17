"use client";

import { Spinner } from "@/components/spinner";
import React, { useEffect, useMemo, useState } from "react";
import { getColumns } from "./document-table-columns";
import { DocumentsTable } from "./document-table";
import { Document } from "./document.type";

export const ListDocuments = () => {
  const [documentData, setdocumentData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores (opcional)

  const columns = useMemo(() => getColumns(), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Comienza la carga
      try {
        const response = await fetch("/api/document");
        if (!response.ok) {
          throw new Error("Error fetching mentors");
        }
        const data = await response.json();

        setdocumentData(data.documents);
        setIsLoading(false); // Finaliza la carga
      } catch (error) {
        setError("Error al cargar mentores"); // En caso de error
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

  return (
    <>
      {/* <pre>{JSON.stringify(documentData, null, 2)}</pre> */}
      <DocumentsTable columns={columns} data={documentData} />
    </>
  );
};
