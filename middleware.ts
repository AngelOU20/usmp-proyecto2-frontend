// export { auth as middleware } from "@/lib/authOptions";

import { auth } from "@/lib/authOptions";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/sign-in") {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/",             // Protege la ruta raíz
    "/fileupload",   // Protege la ruta /fileupload
    "/chat",         // Protege la ruta /chat
    "/faqs",         // Protege la ruta /faqs
  ]
};
