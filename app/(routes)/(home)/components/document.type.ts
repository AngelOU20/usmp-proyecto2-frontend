export type Document = {
  id: string;
  name: string;
  size: number;
  type: "Bitácora" | "Directiva" | "Cronograma";
  dateUpload: string;
};