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

// Interfaz para recibir columnas y datos
interface UserTableProps {
  columns: ColumnDef<Student>[];
  data: Student[];
}

// Función genérica para obtener valores únicos y generar opciones de filtro
const getUniqueValues = <T extends keyof Student>(
  students: Student[],
  key: T
) => {
  const values = students.map((student) => student[key]);
  return Array.from(new Set(values)).filter((value) => value);
};

// Función genérica para generar opciones de filtro dinámicamente
const generateFilterOptions = <T extends keyof Student>(
  students: Student[],
  key: T
) => {
  const uniqueValues = getUniqueValues(students, key);
  return uniqueValues.map((value) => ({
    label: String(value), // Convertir a string para usar como etiqueta en los filtros
    value,
  }));
};

export const StudentTable: React.FC<UserTableProps> = ({ columns, data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Obtener las opciones de filtro para semestre, grupo y asignatura
  const semesterFilterOptions = generateFilterOptions(data, "semester");
  const groupFilterOptions = generateFilterOptions(data, "group");
  const subjectFilterOptions = generateFilterOptions(data, "subject");

  console.log(data);

  const filterFields: DataTableFilterField<Student>[] = [
    {
      label: "Nombre del alumno",
      value: "name",
      placeholder: "Filtrar por nombre del alumno",
    },
    {
      label: "Semestre",
      value: "semester",
      options: semesterFilterOptions,
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
