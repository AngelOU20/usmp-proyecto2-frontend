import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const { AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, AUTH_MICROSOFT_ENTRA_ID_TENANT_ID } = process.env;

export const { handlers, auth, signIn, signOut } = NextAuth({
  // secret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
  providers: [
    MicrosoftEntraID({
      clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  // callbacks: {
  //   async jwt ({ token, account }) {
  //     if (account) {
  //       token = Object.assign({}, token, {
  //         access_token: account.access_token,
  //       });
  //     }
  //     return token;
  //   },
  //   async session ({ session, token }) {
  //     if (session) {
  //       session = Object.assign({}, session, {
  //         access_token: token.access_token,
  //       });
  //       console.log(session);
  //     }
  //     return session;
  //   },
  // },
});