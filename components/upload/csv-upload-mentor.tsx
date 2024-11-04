"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const CsvUploaderMentor = ({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo antes de subir.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch("/api/upload-csv-mentor", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: "El archivo CSV se ha subido correctamente.",
          variant: "default",
        });
        onUploadSuccess();
      } else {
        toast({
          title: "Error",
          description: result.error || "Hubo un error al subir el archivo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al intentar subir el archivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 mb-5">
      <h2 className="text-base font-medium">Subir lista de asesores (CSV)</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-start w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full md:w-2/4 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click para subir</span> CSV
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <p className="mt-2 text-sm text-gray-500">
            Archivo seleccionado: {file.name}
          </p>
        )}

        <Button type="submit" disabled={uploading} className="mt-4">
          {uploading ? "Subiendo..." : "Subir Archivo"}
        </Button>
      </form>
    </div>
  );
};
