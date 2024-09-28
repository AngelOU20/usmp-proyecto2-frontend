"use client";

import { useSession } from "next-auth/react";
import {
  routesForGeneralUser,
  routesForTeamMember,
  routesForMentor,
  routesForAuthority,
  routesForToolsSidebar,
  routesForSupportSidebar,
} from "./sidebar-routes.data";
import { SidebarItem } from "@/components/sidebar-item";
import { SidebarSkeleton } from "@/components/sidebar-routes";
import { Separator } from "@/components/ui/separator";

export const SidebarRoutes = () => {
  const { data: session, status } = useSession();

  console.log("Session:", session, status);

  if (status === "loading") {
    return <SidebarSkeleton />;
  }

  // Determinar qué conjunto de rutas mostrar en función del roleId
  const roleRoutesMap: Record<number, typeof routesForGeneralUser> = {
    1: routesForGeneralUser,
    2: routesForTeamMember,
    3: routesForMentor,
    4: routesForAuthority,
  };

  const routesForRole = roleRoutesMap[session?.user?.roleId || 1];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-2">
        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">GENERAL</p>
          {routesForRole.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            HERRAMIENTAS
          </p>
          {routesForToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">SOPORTE</p>
          {routesForSupportSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div className="p-2">
        <footer className="mt-3 p-3 text-center text-sm text-slate-500">
          2024.{" "}
          <span className="font-medium">
            By{" "}
            <a href="https://github.com/AngelOU20" target="_blank">
              AngelOU20 & Valito
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
};
