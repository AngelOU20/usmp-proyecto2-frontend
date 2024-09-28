// user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  roleId: number;
}

// student.ts
export interface Student {
  email: string;
  nombre: string;
  grupo: string;
  nroMatricula: string;
  titulo: string;
  correoMentor: string;
}
