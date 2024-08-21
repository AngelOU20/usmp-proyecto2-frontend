"use client";

import React, { useState } from "react";

interface FileItem {
  file: File;
  progress: number;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Subida de archivos</h1>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />
      <div className="space-y-4">
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
    </div>
  );
}
