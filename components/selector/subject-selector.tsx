import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectSelectorProps {
  subjects: { id: number; name: string }[];
  selectedSubject: string | undefined;
  setSelectedSubject: (value: string) => void;
  loading: boolean;
  error: string | null;
  valueType?: "id" | "name";
}

export function SubjectSelector({
  subjects,
  selectedSubject,
  setSelectedSubject,
  loading,
  error,
  valueType = "id",
}: SubjectSelectorProps) {
  return (
    <div>
      <label className="mb-2 text-sm">Selecciona una asignatura</label>
      <Select onValueChange={setSelectedSubject} value={selectedSubject}>
        <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
          <SelectValue placeholder="Selecciona una asignatura" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Asignaturas</SelectLabel>
            {loading ? (
              <SelectItem value="loading" disabled>
                Cargando asignaturas...
              </SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>
                Error al cargar asignaturas
              </SelectItem>
            ) : (
              subjects.map((subject) => (
                <SelectItem
                  key={subject.id}
                  value={valueType === "id" ? String(subject.id) : subject.name}
                >
                  {subject.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
