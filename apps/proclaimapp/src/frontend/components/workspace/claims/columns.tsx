"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/frontend/components/ui/badge";

import { labels, priorities, statuses } from "../shared-table/data";
import { DataTableColumnHeader } from "../shared-table/data-table-column-header";
import { DataTableRowActions } from "../shared-table/data-table-row-actions";
import { RouterOutput } from "@/server/api/root";

type Claim = RouterOutput["workspace"]["claims"]["getClaims"][number];

export const columns: ColumnDef<Claim>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "traderef",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trade Ref" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex w-fit space-x-2">
          <span className="font-medium">{row.getValue("traderef")}</span>
          {label && <Badge variant="outline">{label.label}</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const ccy = row.getValue("ccy") as string;
      return (
        <div className="flex w-fit items-center">
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currency: ccy,
            }).format(Number(amount))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "ccy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CCY" />
    ),
  },
  {
    accessorKey: "paydate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("paydate") as Date;

      return (
        <div className="flex w-fit items-center">
          <span>{date.toDateString()}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id)).setHours(0, 0, 0, 0);
      const filterDate = new Date(value).setHours(0, 0, 0, 0);
      return rowDate === filterDate;
    },
  },
  {
    accessorKey: "cp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CP" />
    ),
    cell: ({ row }) => {
      const cp = row.getValue("cp") as string;

      return (
        <div className="flex w-fit items-center">
          <span>{cp}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-fit items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = priorities.find(
        (type) => type.value === row.getValue("type"),
      );

      if (!type) {
        return null;
      }

      return (
        <div className="flex w-fit items-center">
          {type.icon && (
            <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
