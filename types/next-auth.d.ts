import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      roleId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    roleId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roleId?: number;
  }
}