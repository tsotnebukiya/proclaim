"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/frontend/components/ui/hover-card";
import { priorities } from "../shared-table/data";
import { DataTableColumnHeader } from "../shared-table/data-table-column-header";
import { RouterOutput } from "@/server/api/root";
import { shortenAddress } from "@/frontend/lib/utils";
import ClaimDetails from "./claim-details";

type Claim = RouterOutput["workspace"]["cpClaims"]["getCPClaims"][number];

export const columns: ColumnDef<Claim>[] = [
  {
    accessorKey: "contractualSettlementDate",
  },
  {
    accessorKey: "actualSettlementDate",
  },
  {
    accessorKey: "corporateActionID",
  },
  {
    accessorKey: "market",
  },
  {
    accessorKey: "eventRate",
  },
  {
    accessorKey: "quantity",
  },
  {
    accessorKey: "currency",
  },
  {
    accessorKey: "owner",
  },
  {
    accessorKey: "cp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CP" />
    ),
    cell: ({ row }) => {
      const cp = row.getValue("cp") as string;
      const account = row.getValue("owner") as string;
      return (
        <div className="flex w-fit space-x-2">
          <span>{cp}</span>
          <Badge variant="outline">{account}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      console.log(row.getValue(id), value);
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "hash",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claim Hash" />
    ),
    cell: ({ row }) => {
      const hash = row.getValue("hash") as string;
      const paydate = row.getValue("paydate") as string;
      const csd = row.getValue("contractualSettlementDate") as string;
      const asd = row.getValue("actualSettlementDate") as string;
      const ca = row.getValue("corporateActionID") as string;
      const market = row.getValue("market") as string;
      const eventRate = row.getValue("eventRate") as string;
      const qty = row.getValue("quantity") as number;
      const ccy = row.getValue("currency") as string;
      const owner = row.getValue("owner") as string;
      const amount = row.getValue("amount") as number;
      return (
        <div className="flex w-fit">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="text-card-foreground">
                {shortenAddress(row.getValue("hash"))}
              </Button>
            </HoverCardTrigger>
            <ClaimDetails
              claim={{
                hash,
                paydate,
                csd,
                asd,
                ca,
                market,
                eventRate,
                qty,
                ccy,
                owner,
                amount,
              }}
            />
          </HoverCard>
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
      const currency = row.getValue("currency") as string;
      return (
        <div className="flex w-fit items-center">
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currency: currency,
            }).format(Number(amount))}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "paydate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pay Date" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("paydate") as string;
      const date = new Date(Number(timestamp));
      return (
        <div className="flex w-fit items-center">
          <span>{date.toDateString()}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return Number(row.getValue(id)) === value;
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
];
