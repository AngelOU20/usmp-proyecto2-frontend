"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SigninPage() {
  const handleClick = async () => {
    await signIn("microsoft");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Bienvenido
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Inicia sesión para acceder a tu cuenta
        </p>
        <Button
          onClick={handleClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 flex items-center justify-center space-x-2"
        >
          <Image
            src={"/logo-microsoft.png"}
            alt="provider logo"
            height={20}
            width={20}
          />
          <span>Iniciar sesión con Microsoft Entra ID</span>
        </Button>
      </div>
    </div>
  );
}
