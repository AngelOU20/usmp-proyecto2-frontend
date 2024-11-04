import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentTypeSelectorProps {
  documentTypes: { id: number; name: string }[];
  selectedDocumentType: string;
  setSelectedDocumentType: (value: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function DocumentTypeSelector({
  documentTypes,
  selectedDocumentType,
  setSelectedDocumentType,
  loading,
  error,
}: DocumentTypeSelectorProps) {
  return (
    <div>
      <label className="mb-2 text-sm">Selecciona un tipo de documento</label>
      <Select
        onValueChange={setSelectedDocumentType}
        value={selectedDocumentType}
      >
        <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
          <SelectValue placeholder="Selecciona un tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos de documentos</SelectLabel>
            {loading ? (
              <SelectItem value="loading" disabled>
                Cargando tipos de documentos...
              </SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>
                Error al cargar tipos de documentos
              </SelectItem>
            ) : (
              documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
