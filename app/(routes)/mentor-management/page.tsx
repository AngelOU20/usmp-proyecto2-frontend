import { CsvUploaderMentor } from "@/components/upload/csv-upload-mentor";
import { ListMentors } from "./components/list-mentors";

export default function StudentsGroupPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col flex-auto h-full">
      <h1 className="text-2xl font-semibold mb-5">Gestión de asesores</h1>

      <CsvUploaderMentor />

      <ListMentors />
    </div>
  );
}
