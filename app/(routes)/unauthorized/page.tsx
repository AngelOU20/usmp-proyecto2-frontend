import React from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

const UnauthorizedPage = async () => {
  const session = await auth();
  const roleId = session?.user.roleId;

  return (
    <div
      className="flex items-center justify-center bg-gray-100"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Acceso Denegado
        </h1>
        <p className="text-gray-600 mb-4">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <p className="text-gray-500 mb-6">
          Si crees que esto es un error, por favor contacta al administrador.
        </p>
        <Link href={`${roleId !== 1 ? "/" : "/chat"}`}>
          <Button variant="default" className="w-full">
            Volver
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
