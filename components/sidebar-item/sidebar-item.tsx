"use client";

import React from "react";
import Link from "next/link";
import { SidebarItemProps } from "./sidebar-item.type";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const { label, icon: Icon, href } = item;
  const pathName = usePathname();

  const activePath = pathName === href;

  return (
    <Link
      href={href}
      className={cn(
        `flex gap-x-2 mt-2 light: text-slate-700 dark:text-white text-sm items-center hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer`,
        activePath && "bg-slate-400/20"
      )}
    >
      <Icon strokeWidth={1} className="h-5 w-5" />
      {label}
    </Link>
  );
};
