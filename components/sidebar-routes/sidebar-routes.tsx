"use client";

import { useSession } from "next-auth/react";
import {
  dataGeneral1,
  dataGeneral2,
  dataGeneral3,
  dataSupportSidebar,
  dataToolsSidebar,
} from "./sidebar-routes.data";
import { SidebarItem } from "@/components/sidebar-item";
import { Separator } from "@/components/ui/separator";

export const SidebarRoutes = () => {
  const { data: session, status } = useSession();

  console.log("Session:", session, status);

  if (status === "loading") {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se obtiene la sesión
  }

  // Determinar qué conjunto de rutas mostrar en función del roleId
  const dataGeneralSidebar =
    session?.user?.roleId === 1
      ? dataGeneral1
      : session?.user?.roleId === 2
      ? dataGeneral2
      : dataGeneral3;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-2">
        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">GENERAL</p>
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            HERRAMIENTAS
          </p>
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">SOPORTE</p>
          {dataSupportSidebar.map((item) => (
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
