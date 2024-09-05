import {
  FilesIcon,
  BookUser,
  PanelsTopLeft,
  MessagesSquare,
  Upload,
  Settings,
  ShieldCheck,
  CircleHelpIcon,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: FilesIcon,
    label: "Gestión de documentos",
    href: "/",
  },
  {
    icon: BookUser,
    label: "Gestión de grupos",
    href: "/group-students",
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
    label: "Preguntas frecuentes",
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