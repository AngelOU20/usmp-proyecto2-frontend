export interface FileItem {
  file: File;
  progress: number;
}

export interface Group {
  id: number;
  name: string;
  titleProject: string;
  subject: string;
  semester: string;
  students: (string | null)[];
}

export interface TypeDocument {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
}


export interface Semester {
  id: number;
  name: string;
}