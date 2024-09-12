import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { NextAuthConfig } from "next-auth";

const { AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, AUTH_MICROSOFT_ENTRA_ID_TENANT_ID } = process.env;

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    MicrosoftEntraID({
      clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
    }),
  ],
} satisfies NextAuthConfig;