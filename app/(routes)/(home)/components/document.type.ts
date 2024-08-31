export type Document = {
  id: string;
  name: string;
  type: "Bitácora" | "Directiva" | "Cronograma";
  dateUpload: string;
  size: number;
};