// import { auth } from "@/lib/authOptions";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Button } from "../ui/button";
// import Image from "next/image";

// export default async function UserAvatar() {
//   const session = await auth();

//   // Si la sesión es null, redirigir al usuario al inicio de sesión
//   if (!session) {
//     return null; // Retorna null para evitar que el componente se renderice mientras redirige
//   }

//   // Si la sesión no tiene usuario, redirigir al inicio de sesión
//   if (!session.user) {
//     return null;
//   }

//   // Obtener las iniciales del nombre del usuario
//   const getInitials = (name: string): string => {
//     const names = name.split(" ");
//     const initials = names
//       .map((n) => n[0])
//       .join("")
//       .substring(0, 2);
//     return initials.toUpperCase();
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="overflow-hidden rounded-full"
//         >
//           {session.user.image ? (
//             <Image
//               src={session.user.image}
//               width={36}
//               height={36}
//               alt="Avatar"
//               className="overflow-hidden rounded-full"
//             />
//           ) : (
//             <div
//               className="flex items-center justify-center w-9 h-9 rounded-full"
//               style={{
//                 backgroundColor:
//                   "#" + (((1 << 24) * Math.random()) | 0).toString(16),
//               }} // Genera un color aleatorio
//             >
//               <span className="text-white font-medium">
//                 {getInitials(session.user.name || "User")}
//               </span>
//             </div>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel className="capitalize text-sm">
//           {session.user.name}
//         </DropdownMenuLabel>
//         <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Mi cuenta</DropdownMenuItem>
//         <DropdownMenuItem>Configuración</DropdownMenuItem>
//         <DropdownMenuItem>Soporte</DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
