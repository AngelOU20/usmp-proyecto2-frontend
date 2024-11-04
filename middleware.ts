import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";
import { auth as authSession } from "@/lib/auth";

export const { auth } = NextAuth(authConfig);

const authRoutes = ["/sign-in"];
const apiAuthPrefix = "/api/auth";

// Definir rutas protegidas por rol
const roleBasedRoutes: { [key: number]: string[]; } = {
  1: ["/chat", "/faqs"], // Agente Libre
  2: ["/", "/chat", "/faqs"], // Alumno Matriculado
  3: ["/", "/student-group", "/chat", "/faqs"], // Asesor
  4: ["/", "/student-group", "/chat", "/faqs"], // Autoridad
};


export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const session = await authSession();
  const roleId = session?.user?.roleId;

  console.log("sesion:" + roleId);
  console.log({ isLoggedIn, path: nextUrl.pathname });

  // Permitir todas las rutas de API de autenticación
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Redirigir a / si el usuario está logueado y trata de acceder a rutas de autenticación
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    if (roleId === 1) return NextResponse.redirect(new URL("/chat", nextUrl));
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirigir a /sign-in si el usuario no está logueado y trata de acceder a una ruta protegida
  if (!isLoggedIn && !authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // Verificar si el usuario tiene permiso para acceder a la ruta actual según su rol
  if (roleId) {
    const allowedRoutes = roleBasedRoutes[roleId] || [];
    const hasAccess = allowedRoutes.some((route) => nextUrl.pathname.startsWith(route));

    // Si no tiene acceso, redirigir a la página no autorizado
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|unauthorized|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
