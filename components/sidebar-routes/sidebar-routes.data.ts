import {
  BarChart4,
  PanelsTopLeft,
  MessagesSquare,
  Upload,
  Settings,
  ShieldCheck,
  CircleHelpIcon,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: PanelsTopLeft,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Upload,
    label: "Subida de archivos",
    href: "/fileupload",
  },
  {
    icon: MessagesSquare,
    label: "Chat",
    href: "/chat",
  },
];

export const dataToolsSidebar = [
  {
    icon: CircleHelpIcon,
    label: "Faqs",
    href: "/faqs",
  },
  {
    icon: BarChart4,
    label: "Analytics",
    href: "/analytics",
  },
];

export const dataSupportSidebar = [
  {
    icon: Settings,
    label: "Configuración",
    href: "/settings",
  },
  {
    icon: ShieldCheck,
    label: "Seguridad",
    href: "/security",
  },
];