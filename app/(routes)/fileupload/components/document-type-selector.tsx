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
}

export function DocumentTypeSelector({
  documentTypes,
  selectedDocumentType,
  setSelectedDocumentType,
}: DocumentTypeSelectorProps) {
  return (
    <div>
      <label className="mb-2 text-lg">Selecciona un tipo de documento</label>
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
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
