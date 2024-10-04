import { CsvUploaderStudent } from "@/components/upload/csv-upload-student";
import { ListStudents } from "./components/list-students";

export default function StudentsGroupPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col flex-auto h-full">
      <h1 className="text-2xl font-semibold mb-5">Grupo de estudiantes</h1>

      <CsvUploaderStudent />

      <ListStudents />
    </div>
  );
}
