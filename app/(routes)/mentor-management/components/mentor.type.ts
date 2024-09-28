// user.type.ts

// Si solo necesitas algunas propiedades
export interface SimplifiedUser {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  phone?: string | null;
  roleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Mentor {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User; // Relación con el tipo `User`
}
