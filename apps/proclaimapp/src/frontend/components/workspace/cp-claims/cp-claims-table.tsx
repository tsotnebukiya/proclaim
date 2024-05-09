"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";

import { DataTablePagination } from "../shared-table/data-table-pagination";
import { DataTableToolbar } from "../shared-table/data-table-toolbar";
import { api } from "@/trpc/react";
import { RouterOutput } from "@/server/api/root";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  uniqueCpValues: {
    value: string;
    label: string;
  }[];
  workspace: string;
}

type Claim = RouterOutput["workspace"]["cpClaims"]["getCPClaims"][number];

export function CPClaimsTable<TData, TValue>({
  columns,
  data,
  uniqueCpValues,
  workspace,
}: DataTableProps<TData, TValue>) {
  const { data: fetchedData, refetch } =
    api.workspace.cpClaims.getCPClaims.useQuery(
      { workspace },
      {
        initialData: data as Claim[],
      },
    );
  const { mutate, isPending } =
    api.workspace.cpClaims.refetchCPCLaims.useMutation({
      onSuccess: () => {
        refetch();
        toast.success("Success", {
          description: "CP pending claims refetched",
        });
      },
    });
  const onRefresh = () => {
    mutate({ workspace });
  };
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      contractualSettlementDate: false,
      actualSettlementDate: false,
      corporateActionID: false,
      market: false,
      eventRate: false,
      quantity: false,
      currency: false,
      owner: false,
    });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: fetchedData as TData[],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-2">
      <DataTableToolbar
        table={table}
        cpOptions={uniqueCpValues}
        type="cp"
        isRefreshing={isPending}
        onRefresh={onRefresh}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
