"use client";
import { Separator } from "../ui/separator";
import RequestToken from "./request-token";
import TokenStats from "./token-stats";

import { Divider } from "@tremor/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { useState } from "react";
import { FormControl } from "../ui/form";

const tokens = [{ name: "USD" }, { name: "EUR" }];

export default function Funding() {
  const [token, setToken] = useState(tokens[0]?.name!);
  return (
    <div className="grid flex-1 grid-cols-[1fr,1fr,auto,1fr] gap-6">
      <div className="col-span-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
              Token Overview
            </h3>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-tremor-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
              {tokens.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Select onValueChange={setToken} defaultValue={token}>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((t) => (
                  <SelectItem value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Divider className="my-4" />
        <TokenStats />
      </div>
      <Separator orientation="vertical" className="" />
      <RequestToken />
    </div>
  );
}
