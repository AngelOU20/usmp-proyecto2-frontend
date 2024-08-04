"use client";

import React from "react";
import {
  dataGeneralSidebar,
  dataSupportSidebar,
  dataToolsSidebar,
} from "./sidebar-routes.type";
import { SidebarItem } from "@/components/sidebar-item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const SidebarRoutes = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-2">
        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-200 mb-4">GENERAL</p>
          {dataGeneralSidebar.map((item) => (
            <React.Fragment key={item.label}>
              <SidebarItem item={item} />
            </React.Fragment>
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-200 mb-4">
            HERRAMIENTAS
          </p>
          {dataToolsSidebar.map((item) => (
            <React.Fragment key={item.label}>
              <SidebarItem item={item} />
            </React.Fragment>
          ))}
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-200 mb-4">SOPORTE</p>
          {dataSupportSidebar.map((item) => (
            <React.Fragment key={item.label}>
              <SidebarItem item={item} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-2">
        <div className="text-center p-6">
          <Button variant="outline" className="w-full">
            Cerrar Sesión
          </Button>
        </div>
        <Separator />
        <footer className="mt-3 p-3 text-center text-sm text-slate-500">
          2024.{" "}
          <span className="font-medium">
            By{" "}
            <a href="https://github.com/AngelOU20" target="_blank">
              AngelOU20
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
};