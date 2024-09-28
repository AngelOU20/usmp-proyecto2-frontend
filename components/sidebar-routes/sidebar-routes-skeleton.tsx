"use client";

import { Separator } from "@/components/ui/separator";

export const SidebarSkeleton = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-2">
        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">GENERAL</p>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            HERRAMIENTAS
          </p>
          <SkeletonItem />
        </div>

        <Separator />

        <div className="p-2 md:p-6">
          <p className="text-slate-500 dark:text-slate-400 mb-4">SOPORTE</p>
          <SkeletonItem />
          <SkeletonItem />
        </div>
      </div>
    </div>
  );
};

const SkeletonItem = () => {
  return (
    <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mb-3"></div>
  );
};
