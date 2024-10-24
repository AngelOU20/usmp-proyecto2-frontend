import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectSemesterSelectorProps {
  subjects: { id: number; name: string }[];
  semesters: { id: number; name: string }[];
  selectedSubject: string;
  selectedSemester: string;
  setSelectedSubject: (value: string) => void;
  setSelectedSemester: (value: string) => void;
}

export function SubjectSemesterSelector({
  subjects,
  semesters,
  selectedSubject,
  selectedSemester,
  setSelectedSubject,
  setSelectedSemester,
}: SubjectSemesterSelectorProps) {
  return (
    <>
      <div>
        <label className="mb-2 text-lg">Selecciona una asignatura</label>
        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
          <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
            <SelectValue placeholder="Selecciona una asignatura" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Asignaturas</SelectLabel>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={String(subject.id)}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 text-lg">Selecciona un semestre</label>
        <Select onValueChange={setSelectedSemester} value={selectedSemester}>
          <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
            <SelectValue placeholder="Selecciona un semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semestres</SelectLabel>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={String(semester.id)}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
