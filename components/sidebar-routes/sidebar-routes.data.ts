import {
  FilesIcon,
  BookUser,
  MessagesSquare,
  Upload,
  Settings,
  ShieldCheck,
  CircleHelpIcon,
  User2,
} from "lucide-react";

// Definir los roles permitidos para cada ruta
export const routesForGeneralUser = [
  {
    icon: MessagesSquare,
    label: "Chat",
    href: "/chat",
  },
];

export const routesForTeamMember = [
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

export const routesForMentor = [
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
    icon: BookUser,
    label: "Gestión de grupos",
    href: "/student-group",
  },
  {
    icon: MessagesSquare,
    label: "Chat",
    href: "/chat",
  },
];
export const routesForAuthority = [
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
    icon: BookUser,
    label: "Gestión de grupos",
    href: "/student-group",
  },
  {
    icon: User2,
    label: "Gestión de asesores",
    href: "/mentor-management",
  },
  {
    icon: MessagesSquare,
    label: "Chat",
    href: "/chat",
  },
];

export const routesForToolsSidebar = [
  {
    icon: CircleHelpIcon,
    label: "Preguntas frecuentes",
    href: "/faqs",
  },
];

export const routesForSupportSidebar = [
  {
    icon: Settings,
    label: "Configuración",
    href: "/settings",
  },
  // {
  //   icon: ShieldCheck,
  //   label: "Seguridad",
  //   href: "/security",
  // },
];
