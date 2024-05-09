"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

import { priorities, statuses } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CalendarPayDate } from "./calendar";
import { useState } from "react";
import { warsawTime } from "@/server/lib/utils";
import moment from "moment-timezone";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  cpOptions: {
    value: string;
    label: string;
  }[];
  type: "cp" | "own";
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  cpOptions,
  type,
  isRefreshing,
  onRefresh,
}: DataTableToolbarProps<TData>) {
  const [date, setDate] = useState<Date | undefined>();
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleDateChange = (date: Date) => {
    setDate(date);
    if (type === "own") {
      table.getColumn("paydate")?.setFilterValue(date);
    }
    if (type === "cp") {
      table
        .getColumn("paydate")
        ?.setFilterValue(moment(date).add(+2, "hours").valueOf());
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {type === "own" && (
          <Input
            placeholder="Filter claims..."
            value={
              (table.getColumn("traderef")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("traderef")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px]"
          />
        )}
        {type === "cp" && (
          <Input
            placeholder="Filter CPs..."
            value={(table.getColumn("owner")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              console.log(event.target.value);
              table.getColumn("owner")?.setFilterValue(event.target.value);
            }}
            className="h-8 w-[150px]"
          />
        )}

        {type === "own" && table.getColumn("status") ? (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        ) : null}
        {type === "own" && table.getColumn("type") ? (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={priorities}
          />
        ) : null}
        {table.getColumn("cp") && (
          <DataTableFacetedFilter
            column={table.getColumn("cp")}
            title="CP"
            options={cpOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setDate(undefined);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {/* <DataTableViewOptions table={table} /> */}
        <CalendarPayDate date={date} handleDateChange={handleDateChange} />
        {type === "cp" && (
          <Button className="h-8" loading={isRefreshing} onClick={onRefresh}>
            Refetch
          </Button>
        )}
      </div>
    </div>
  );
}
