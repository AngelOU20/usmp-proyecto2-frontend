// Define opciones de filtro
export type Option = {
  label: string;
  value: string;
};

// Define la interfaz para los campos del filtro de tabla, generalizable para cualquier tipo de datos
export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}
