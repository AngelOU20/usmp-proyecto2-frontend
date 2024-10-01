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

// Función para extraer los semestres y grupos únicos
const getUniqueSemesters = (students: Student[]): string[] => {
  const semesters = students.map((student) => student.semester);
  return Array.from(new Set(semesters)).filter((semester) => semester); // Elimina duplicados y nulls
};

const getUniqueGroups = (students: Student[]): string[] => {
  const groups = students.map((student) => student.group);
  return Array.from(new Set(groups)).filter((group) => group);
};

const getUniqueSubjects = (students: Student[]): string[] => {
  const subjects = students.map((student) => student.subject);
  return Array.from(new Set(subjects)).filter((subject) => subject);
};

// Generar las opciones de filtro dinámicamente para el semestre y grupo
const generateSemesterFilterOptions = (students: Student[]) => {
  const semesters = getUniqueSemesters(students);
  return semesters.map((semester) => ({
    label: semester,
    value: semester,
  }));
};

const generateGroupFilterOptions = (students: Student[]) => {
  const groups = getUniqueGroups(students);
  return groups.map((group) => ({
    label: group,
    value: group,
  }));
};

const generateSubjectFilterOptions = (students: Student[]) => {
  const subjects = getUniqueSubjects(students);
  return subjects.map((subject) => ({
    label: subject,
    value: subject,
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

  // Generar las opciones de filtro para el semestre
  const semesterFilterOptions = generateSemesterFilterOptions(data);

  const groupFilterOptions = generateGroupFilterOptions(data);

  const subjectFilterOptions = generateSubjectFilterOptions(data);

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
