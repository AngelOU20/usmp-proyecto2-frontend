"use client";

import * as React from "react";

import {
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
import { SimplifiedUser } from "./mentor.type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableFilterField } from "@/types/data-table.types";
import { DataTable } from "@/components/data-table/data-table";

// Actualiza el UserTable para recibir `data` como prop
interface UserTableProps {
  columns: ColumnDef<SimplifiedUser>[];
  data: SimplifiedUser[];
}

const filterFields: DataTableFilterField<SimplifiedUser>[] = [
  {
    label: "Nombre del asesor",
    value: "name",
    placeholder: "Filtrar por el nombre",
  },
];

export const MentorTable: React.FC<UserTableProps> = ({ columns, data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      rowSelection,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
};
