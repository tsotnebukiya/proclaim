"use client";

import { Divider } from "@tremor/react";
import { Button } from "../ui/button";
import ContractsCode from "./contracts-code";
import ContractBlocks from "./contracts-blocks";
import { useState } from "react";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export type ContractType = "depo" | "token" | "claim";

type ContractsReturn = RouterOutput["contract"]["getContracts"];

export default function ContractsList({ items }: { items: ContractsReturn }) {
  const [type, setType] = useState<ContractType>("depo");
  const { data, refetch } = api.contract.getContracts.useQuery(undefined, {
    initialData: items,
  });
  const refetchHandler =async () => {
    await refetch();
  };
  const { mutate, isPending } = api.contract.refetchContracts.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Success", {
        description: "Contracts data refreshed",
      });
    },
  });
  const onRefresh = () => {
    mutate();
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
            Contracts
          </h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-tremor-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
            {data.length}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="default" onClick={onRefresh} loading={isPending}>
            Refresh
          </Button>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid flex-1 grid-cols-2 gap-8">
        <ContractBlocks
          setType={setType}
          items={data}
          refetchHandler={refetchHandler}
        />
        <ContractsCode setType={setType} type={type} />
      </div>
    </>
  );
}
