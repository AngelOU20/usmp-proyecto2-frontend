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

export function getColumns(
  handleDelete: (id: string) => void
): ColumnDef<Student>[] {
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
      accessorKey: "name",
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
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "registrationNumber",
      header: "Número de matricula",
      cell: ({ row }) => <div>{row.getValue("registrationNumber")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "group",
      header: "Grupo",
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue("group")}</div>
      ),
      filterFn: (row, columnId, filterValue) => {
        console.log(
          "Filtrando grupo:",
          row.getValue(columnId),
          "con",
          filterValue
        );
        // Asegúrate de que `filterValue` es un array y toma el primer valor
        return (
          (row.getValue(columnId) as string).toUpperCase() ===
          (filterValue[0] as string).toUpperCase()
        );
      },
    },
    {
      accessorKey: "mentor",
      header: "Asesor",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("mentor")}</div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Asignatura",
      cell: ({ row }) => <div>{row.getValue("subject")}</div>,
      filterFn: (row, columnId, filterValue) => {
        console.log("Filtrando:", row.getValue(columnId), "con", filterValue);
        // Accedemos al primer elemento de filterValue si es un array
        const filterText = Array.isArray(filterValue)
          ? filterValue[0]
          : filterValue;
        return (
          (row.getValue(columnId) as string).toLowerCase() ===
          filterText.toLowerCase()
        );
      },
    },
    {
      accessorKey: "semester",
      header: "Semestre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("semester")}</div>
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
                onClick={() => handleDelete(user.id!)}
              >
                Remover estudiante
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
