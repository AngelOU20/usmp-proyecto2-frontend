"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTableToolbar } from "@/components/data-table";
import { Document } from "./document.type";
import { DataTableFilterField, Option } from "@/types/data-table.types";
import { DataTable } from "@/components/data-table/data-table";

// Define las opciones de tipo de documento basadas en el tipo definido
const fileTypeOptions: Option[] = [
  { label: "Bitácora", value: "Bitacora" },
  { label: "Rubrica", value: "Rubrica" },
  { label: "Informes", value: "Informes" },
  { label: "Directiva", value: "Directiva" },
  { label: "Otros", value: "Otros" },
];

// Actualiza el UserTable para recibir `data` como prop
interface DocumentTableProps {
  columns: ColumnDef<Document>[];
  data: Document[];
}

export const DocumentsTable: React.FC<DocumentTableProps> = ({
  columns,
  data,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const filterFields: DataTableFilterField<Document>[] = [
    {
      label: "Nombre del Documento",
      value: "name",
      placeholder: "Filtrar por nombre del documento",
    },
    {
      label: "Tipo de documento",
      value: "type",
      options: fileTypeOptions,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning: { right: ["actions"] },
      rowSelection,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
};
