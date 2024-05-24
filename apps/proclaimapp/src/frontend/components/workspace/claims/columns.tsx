"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";

import { Badge } from "@/frontend/components/ui/badge";

import { labels, priorities, statuses } from "../shared-table/data";
import { DataTableColumnHeader } from "../shared-table/data-table-column-header";
import { DataTableRowActions } from "../shared-table/data-table-row-actions";
import { RouterOutput } from "@/server/api/root";
import { cn } from "@/frontend/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../../ui/button";

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
    cell: ({ row, table }) => {
      const label = labels.find((label) => label.value === row.original.label);
      const tradeRef = row.getValue("traderef") as string;
      return (
        <div className="flex w-fit space-x-2">
          <Link
            href={"claims/" + tradeRef}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-[30px] p-0 text-foreground",
            )}
          >
            {tradeRef}
          </Link>
          {label && (
            <Badge variant="outline" className="w-fit">
              {label.label}
            </Badge>
          )}
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
      const formatter = new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      return (
        <div className="flex w-fit items-center">
          <span>{formatter.format(date)}</span>
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
    accessorKey: "eventType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const eventType = row.getValue("eventType") as string;

      return (
        <div className="w-min">
          <span>{eventType}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "corporateActionID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="20C CORP" />
    ),
    cell: ({ row }) => {
      const corporateActionID = row.getValue("corporateActionID") as string;

      return (
        <div className="flex w-fit items-center">
          <span>{corporateActionID}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
            <status.icon className={cn("mr-2 h-4 w-4", status.color)} />
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
