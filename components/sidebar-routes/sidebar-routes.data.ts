import {
  FilesIcon,
  BookUser,
  MessagesSquare,
  Upload,
  Settings,
  ShieldCheck,
  CircleHelpIcon,
} from "lucide-react";

// Definir los roles permitidos para cada ruta
export const dataGeneral1 = [
  {
    icon: MessagesSquare,
    label: "Chat",
    href: "/chat",
  },
];

export const dataGeneral2 = [
  {
    icon: FilesIcon,
    label: "Gestión de documentos",
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

export const dataGeneral3 = [
  {
    icon: FilesIcon,
    label: "Gestión de documentos",
    href: "/",
  },
  {
    icon: BookUser,
    label: "Gestión de grupos",
    href: "/student-group",
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
