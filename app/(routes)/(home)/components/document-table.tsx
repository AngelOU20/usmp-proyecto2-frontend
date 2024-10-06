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
import { generateFilterOptions } from "@/lib/utils";
import { getDocumentTypes } from "@/actions/getDocumentTypes";

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

  const [documentTypeOptions, setDocumentTypeOptions] = React.useState<
    Option[]
  >([]);

  React.useEffect(() => {
    async function fetchDocumentTypes() {
      try {
        const types = await getDocumentTypes();
        setDocumentTypeOptions(
          types.map((type) => ({
            label: type.name,
            value: type.name,
          }))
        );
      } catch (error) {
        console.error("Error al obtener los tipos de documentos:", error);
      }
    }

    fetchDocumentTypes();
  }, []);

  // const typeFilterOptions = generateFilterOptions(data, "type");
  const groupFilterOptions = generateFilterOptions(data, "groupName");
  const subjectFilterOptions = generateFilterOptions(data, "subjectName");

  const filterFields: DataTableFilterField<Document>[] = [
    {
      label: "Nombre del Documento",
      value: "name",
      placeholder: "Filtrar por nombre del documento",
    },
    {
      label: "Nombre del estudiante",
      value: "students",
      placeholder: "Filtrar por estudiante",
    },
    {
      label: "Tipo de documento",
      value: "type",
      options: documentTypeOptions,
    },
    {
      label: "Grupo",
      value: "groupName",
      options: groupFilterOptions,
    },
    {
      label: "Asignatura",
      value: "subjectName",
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
