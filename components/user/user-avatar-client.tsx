"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";

export const UserAvatar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-300 animate-pulse">
        {/* Puedes personalizar este skeleton */}
      </div>
    );
  }

  if (!session || !user) {
    return null; // No renderizar nada si no hay sesión
  }

  // Obtener las iniciales del nombre del usuario
  const getInitials = (name: string): string => {
    const names = name.split(" ");
    const initials = names
      .map((n) => n[0])
      .join("")
      .substring(0, 2);
    return initials.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              backgroundColor:
                "#" + (((1 << 24) * Math.random()) | 0).toString(16),
            }} // Genera un color aleatorio
          >
            <span className="text-white font-medium">
              {getInitials(user.name || "User")}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-sm -mb-2">
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-slate-900 dark:text-slate-200 text-xs font-normal">
          {user.email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          <span>Mi cuenta</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          <span>Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
