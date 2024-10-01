// user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  roleId: number;
}

// student.ts
export interface Student {
  nroMatricula: string;
  nombre: string;
  correo: string;
  grupo: string;
  correoAsesor: string;
  titulo: string;
  semestre: string;
  asignatura: string;
}
