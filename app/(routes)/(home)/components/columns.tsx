"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { Document } from "./document.type";

export const columns: ColumnDef<Document>[] = [
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
    header: "Nombre",
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-2">
        <Image
          src="/pdf.png"
          alt="Image to document type"
          height={20}
          width={20}
        />
        <span>{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo de documento",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "dateUpload",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de subida
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase px-4">{row.getValue("dateUpload")}</div>
    ),
  },
  {
    accessorKey: "size",
    header: () => <div className="text-right">Tamaño</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("size")} MB</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const document = row.original;

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
              onClick={() => navigator.clipboard.writeText(document.id)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];