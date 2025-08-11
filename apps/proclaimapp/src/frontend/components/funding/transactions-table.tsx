"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownToLine,
  ArrowUpDown,
  ArrowUpToLine,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { Input } from "@/frontend/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import { shortenAddress } from "@/frontend/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RouterOutput } from "@/server/api/root";

type Transaction = {
  amount: number;
  tofrom: string;
  claim: string;
  teamSlug: string;
  ccy: string;
  transaction: string;
};

export const getColumns = (
  onClaimView: ({
    teamSlug,
    claim,
  }: {
    teamSlug: string;
    claim: string;
  }) => void,
) => {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "transaction",
      header: "Transaction",
      cell: ({ row }) => (
        <div className="capitalize">
          {shortenAddress(row.getValue("transaction"))}
        </div>
      ),
    },
    {
      accessorKey: "ccy",
    },
    {
      accessorKey: "teamSlug",
    },
    {
      accessorKey: "tofrom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            To/From
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("tofrom")}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const rawAmount = parseFloat(row.getValue("amount"));
        const amount = Math.abs(rawAmount);

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.getValue("ccy") === "usd" ? "USD" : "EUR",
        }).format(amount);

        return (
          <div className="flex gap-2 font-medium">
            {rawAmount < 0 ? (
              <ArrowDownToLine size={16} className="text-destructive" />
            ) : (
              <ArrowUpToLine size={16} className="text-primary" />
            )}

            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "claim",
      header: "Claim",
      cell: ({ row }) => <div>{row.getValue("claim")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const teamSlug = row.getValue("teamSlug") as string;
        const claim = row.getValue("claim") as string;
        const transaction = row.getValue("transaction") as string;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link
                target="_blank"
                href={`https://explorer.stavanger.gateway.fm/tx/${transaction}`}
              >
                <DropdownMenuItem>View Transaction</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onClaimView({ claim, teamSlug })}
              >
                View claim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};

export function TransactionsTable({
  transfers,
}: {
  transfers: RouterOutput["funding"]["getGeneralData"]["transfers"];
}) {
  const router = useRouter();
  const onClaimView = ({
    teamSlug,
    claim,
  }: {
    teamSlug: string;
    claim: string;
  }) => {
    router.push(`/portal/${teamSlug}/claims/${claim}`);
  };
  const columns = getColumns(onClaimView);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ ccy: false, teamSlug: false });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: transfers,
    columns,
    initialState: {
      pagination: { pageSize: 8 },
    },
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
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <Input
          placeholder="Filter by Counterparty..."
          value={(table.getColumn("tofrom")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("tofrom")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
    </div>
  );
}
