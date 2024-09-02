export type Document = {
  id: string;
  name: string;
  size: number;
  type: "Bitácora" | "Directiva" | "Cronograma";
  dateUpload: string;
};

export type Option = {
  label: string;
  value: string;
};

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}