import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SemesterSelectorProps {
  semesters: { id: number; name: string }[];
  selectedSemester: string | undefined;
  setSelectedSemester: (value: string) => void;
  loading: boolean;
  error: string | null;
  valueType?: "id" | "name";
}

export function SemesterSelector({
  semesters,
  selectedSemester,
  setSelectedSemester,
  loading,
  error,
  valueType = "id",
}: SemesterSelectorProps) {
  return (
    <div>
      <label className="mb-2 text-sm">Selecciona un semestre</label>
      <Select onValueChange={setSelectedSemester} value={selectedSemester}>
        <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
          <SelectValue placeholder="Selecciona un semestre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Semestres</SelectLabel>
            {loading ? (
              <SelectItem value="loading" disabled>
                Cargando semestres...
              </SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>
                Error al cargar semestres
              </SelectItem>
            ) : (
              semesters.map((semester) => (
                <SelectItem
                  key={semester.id}
                  value={
                    valueType === "id" ? String(semester.id) : semester.name
                  }
                >
                  {semester.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
