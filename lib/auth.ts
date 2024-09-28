import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const { AUTH_SECRET } = process.env;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar información adicional al token.
    jwt ({ token, user }) {
      if (user) { // User is available during sign-in
        token.roleId = user.roleId;
      }
      return token;
    },

    // session() se utiliza para agregar la información del token a la sesión del usuario,
    // lo que hace que esté disponible en el cliente.
    session ({ session, token }) {
      if (session.user) {
        session.user.roleId = token.roleId;
      }
      return session;
    },
  },
});