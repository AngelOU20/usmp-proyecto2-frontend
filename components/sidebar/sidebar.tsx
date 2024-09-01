import { Logo } from "@/components/logo";
import { SidebarRoutes } from "@/components/sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col border-r">
        <div className="flex flex-col">
          <Logo />
          <p className="pl-10 text-xs text-red-700 dark:text-white font-semibold">
            Escuela de Ingeniería de Computación y Sistemas
          </p>
        </div>
        <SidebarRoutes />
      </div>
    </div>
  );
};
