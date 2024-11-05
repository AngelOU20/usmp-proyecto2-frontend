"use client";

import { useState } from "react";
import { CsvUploaderStudent } from "@/components/upload/csv-upload-student";
import { ListStudents } from "./components/list-students";
import { CloseSemesterControl } from "./components/close-semester-control";

export default function StudentsGroupPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col flex-auto h-full">
      <h1 className="text-2xl font-semibold mb-5">Grupo de estudiantes</h1>

      <div className="flex justify-between w-full gap-4">
        <CsvUploaderStudent
          className="flex-1"
          onUploadSuccess={triggerRefresh}
        />
        <CloseSemesterControl onCloseSuccess={triggerRefresh} />
      </div>

      <ListStudents refreshKey={refreshKey} />
    </div>
  );
}
