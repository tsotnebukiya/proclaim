"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

import { priorities, statuses } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CalendarPayDate } from "./calendar";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  cpOptions: {
    value: string;
    label: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  cpOptions,
}: DataTableToolbarProps<TData>) {
  const [date, setDate] = useState<Date | undefined>();
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleDateChange = (date: Date) => {
    setDate(date);
    table.getColumn("paydate")?.setFilterValue(date);
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={
            (table.getColumn("traderef")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("traderef")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={priorities}
          />
        )}
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
      </div>
    </div>
  );
}
