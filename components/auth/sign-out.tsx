"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <Button variant="outline" className="w-full" onClick={() => signOut()}>
      <LogOut className="w-4 h-4 mr-2" />
      Cerrar Sesión
    </Button>
  );
}
