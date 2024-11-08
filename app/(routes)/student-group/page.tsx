"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CsvUploaderStudent } from "@/components/upload/csv-upload-student";
import { ListStudents } from "./components/list-students";
import { CloseSemesterControl } from "./components/close-semester-control";
import { Spinner } from "@/components/spinner";

export default function StudentsGroupPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session, status } = useSession();

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col flex-auto h-full">
      <h1 className="text-2xl font-semibold mb-5">Grupo de estudiantes</h1>

      <div className="flex justify-between w-full gap-4">
        <CsvUploaderStudent
          className="flex-1"
          onUploadSuccess={triggerRefresh}
        />
        {session?.user.roleId === 4 && (
          <CloseSemesterControl onCloseSuccess={triggerRefresh} />
        )}
      </div>

      <ListStudents refreshKey={refreshKey} />
    </div>
  );
}
