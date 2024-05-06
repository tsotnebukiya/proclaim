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
import { useRouter } from "next/navigation";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";

const tokens = [{ name: "usd" }, { name: "eur" }];

type Props = {
  ccy: string;
  fundingData: RouterOutput["funding"]["getGeneralData"];
};

export default function Funding({ ccy, fundingData }: Props) {
  const { data, refetch } = api.funding.getGeneralData.useQuery(
    { token: ccy },
    {
      initialData: fundingData,
    },
  );
  const handleRefetch = async () => {
    await refetch();
  };
  const { generalData, requests, transfers } = data;
  const { push } = useRouter();
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
            <Select
              onValueChange={(el) => push(`/portal/funding/${el}`)}
              defaultValue={ccy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((t) => (
                  <SelectItem value={t.name}>{t.name.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Divider className="my-4" />
        <TokenStats generalData={generalData} transfers={transfers} ccy={ccy} />
      </div>
      <Separator orientation="vertical" className="" />
      <RequestToken
        ccy={ccy.toUpperCase()}
        requests={requests}
        handleRefetch={handleRefetch}
      />
    </div>
  );
}
