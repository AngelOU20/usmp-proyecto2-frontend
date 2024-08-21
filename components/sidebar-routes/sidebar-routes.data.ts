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
    label: "Inicio",
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