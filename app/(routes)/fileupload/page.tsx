"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface FileItem {
  file: File;
  progress: number;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).map((file) => ({
      file,
      progress: 0,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileItem: FileItem, index: number) => {
    const formData = new FormData();
    formData.append("file", fileItem.file);

    // Simulando la subida de archivos y actualizando el progreso
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index].progress = progress;
        return newFiles;
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Subida de archivos</h1>
      <div>
        {/* Selector del tipo de documento */}
        <label className="mb-2 text-lg">Selecciona un tipo de documento</label>
        <Select onValueChange={(value) => setSelectedDocumentType(value)}>
          <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
            <SelectValue placeholder="Selecciona..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de documentos</SelectLabel>
              <SelectItem value="Bitacora">Bitacora</SelectItem>
              <SelectItem value="Cronograma">Cronograma</SelectItem>
              <SelectItem value="Directiva">Directiva</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Botón para seleccionar archivos */}
        <div className="border p-6 rounded-lg w-full max-w-xl flex justify-center mb-4">
          <label htmlFor="file-upload" className="cursor-pointer px-4 py-2">
            Subir archivos
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Mostrar archivos seleccionados y barra de progreso */}
        <div className="space-y-4 w-full max-w-xl">
          {files.map((fileItem, index) => (
            <div key={index} className="relative p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <span>
                  {fileItem.file.name} (
                  {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </div>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${fileItem.progress}%` }}
                />
              </div>
              {fileItem.progress < 100 && (
                <button
                  onClick={() => uploadFile(fileItem, index)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Subir
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botón para cargar los archivos */}
        <Button className="bg-black text-white px-6 py-2 rounded mt-4 mb-4">
          Cargar archivos
        </Button>
      </div>
    </div>
  );
}
