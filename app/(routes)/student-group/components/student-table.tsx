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
import { DataTableFilterField } from "@/types/data-table.types";
import { Student } from "./student.type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { generateFilterOptions } from "@/lib/utils";

interface UserTableProps {
  columns: ColumnDef<Student>[];
  data: Student[];
}

export const StudentTable: React.FC<UserTableProps> = ({ columns, data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const semesterFilterOptions = generateFilterOptions(data, "semester");
  const groupFilterOptions = generateFilterOptions(data, "group");
  const subjectFilterOptions = generateFilterOptions(data, "subject");

  const filterFields: DataTableFilterField<Student>[] = [
    {
      label: "Nombre del alumno",
      value: "name",
      placeholder: "Filtrar por nombre del alumno",
    },
    {
      label: "Grupo",
      value: "group",
      options: groupFilterOptions,
    },
    {
      label: "Asignatura",
      value: "subject",
      options: subjectFilterOptions,
    },
    {
      label: "Semestre",
      value: "semester",
      options: semesterFilterOptions,
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
      rowSelection,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
};
