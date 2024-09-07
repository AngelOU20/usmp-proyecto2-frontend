import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const { AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, AUTH_MICROSOFT_ENTRA_ID_TENANT_ID, AUTH_SECRET } = process.env;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: AUTH_SECRET,
  providers: [
    MicrosoftEntraID({
      clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
    }),
  ],
});