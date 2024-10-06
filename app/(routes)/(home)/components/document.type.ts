export type Document = {
  id: number;
  name: string;
  size: number;
  uploadDate: string;
  type: "Bitacora" | "Cronograma" | "Informes" | "Directiva" | "Otros";
  isGlobal?: boolean;
  students: string[];
  groupName: string;
  subjectName: string;
  semesterName: string;
};

