import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "@/components/sidebar-routes";
import { ModeToggle } from "@/components/toogle-theme";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-2 gap-x-4 md:px-6 w-full h-20 bg-background border-b">
      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative w-80">
        <Input placeholder="Search..." className="rounded-lg" />
        <Search strokeWidth={1} className="absolute top-2 right-2" />
      </div>
      <div className="flex gap-x-2 md:gap-x-8 items-center">
        <ModeToggle />
        {/* <UserButton /> */}
      </div>
    </nav>
  );
};
