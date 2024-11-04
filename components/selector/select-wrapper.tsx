import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectWrapperProps<T> {
  label: string;
  placeholder: string;
  items: T[];
  loading: boolean;
  error: string | null;
  value: string;
  setValue: (value: string) => void;
  itemLabel: (item: T) => string;
  itemValue: (item: T) => string;
  onItemHover?: (item: T) => void;
  onItemLeave?: () => void;
}

export function SelectWrapper<T>({
  label,
  placeholder,
  items,
  loading,
  error,
  value,
  setValue,
  itemLabel,
  itemValue,
  onItemHover,
  onItemLeave,
}: SelectWrapperProps<T>) {
  return (
    <div>
      <label className="mb-2 text-lg">{label}</label>
      <Select onValueChange={setValue} value={value}>
        <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {loading ? (
              <SelectItem value="loading" disabled>
                Cargando {label.toLowerCase()}...
              </SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>
                Error al cargar {label.toLowerCase()}
              </SelectItem>
            ) : (
              items.map((item) => (
                <SelectItem
                  key={itemValue(item)}
                  value={itemValue(item)}
                  onMouseEnter={() => onItemHover?.(item)}
                  onMouseLeave={onItemLeave}
                >
                  {itemLabel(item)}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
