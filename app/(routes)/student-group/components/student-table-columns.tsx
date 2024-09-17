import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table";
import { Student } from "./student.type";

export function getColumns(): ColumnDef<Student>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name", // Coincide con la clave en el JSON
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Alumnos matriculados" />
      ),
      cell: ({ row }) => (
        <div className="capitalize px-2">
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status", // Coincide con la clave en el JSON
      header: "Estado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "registrationNumber", // Coincide con la clave en el JSON
      header: "Número de matricula",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("registrationNumber")}</div>
      ),
    },
    {
      accessorKey: "email", // Coincide con la clave en el JSON
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "group", // Coincide con la clave en el JSON
      header: "Grupo",
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue("group")}</div>
      ),
    },
    {
      accessorKey: "mentor", // Coincide con la clave en el JSON
      header: "Asesor",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("mentor")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(String(user.id))}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
