"use client";

import * as React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const data: Document[] = [
  {
    id: "m5gr84i9",
    name: "2022-1 DIRECTIVA CURSOS PROYECTO I y II JULIO2022",
    size: 3.16,
    type: "Directiva",
    dateUpload: "22 de julio de 2024",
  },
  {
    id: "3u1reuv4",
    name: "BITACORA_Ucharima_Valer_242_P2_S01aS02",
    size: 2.42,
    type: "Bitácora",
    dateUpload: "22 de julio de 2024",
  },
  {
    id: "derv1ws0",
    name: "BITACORA_Ucharima_Valer_242_P2_S03",
    size: 8.37,
    type: "Bitácora",
    dateUpload: "22 de julio de 2024",
  },
  {
    id: "5kma53ae",
    name: "Cronograma_EF_Proyecto_I",
    size: 8.74,
    type: "Cronograma",
    dateUpload: "22 de julio de 2024",
  },
  {
    id: "bhqecj4p",
    name: "Cronograma_EF_Proyecto_II",
    size: 7.21,
    type: "Cronograma",
    dateUpload: "22 de julio de 2024",
  },
];

export type Document = {
  id: string;
  name: string;
  type: "Bitácora" | "Directiva" | "Cronograma";
  dateUpload: string;
  size: number;
};

export const columns: ColumnDef<Document>[] = [
  {
    id: "select",
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
