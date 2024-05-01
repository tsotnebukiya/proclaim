import PrismLoader from "@/frontend/lib/prism-loader";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { claimContract, depositoryContract, tokenContract } from "./code";
import { Dispatch, SetStateAction, useState } from "react";
import { ContractType } from "./contracts-list";

function ContractScroll({ code }: { code: string }) {
  return (
    <ScrollArea className="rounded-md">
      <pre className="language-solidity !m-0 !whitespace-pre-wrap rounded-md">
        <code className="language-solidity !whitespace-pre-wrap rounded-md">
          {code}
        </code>
      </pre>
      <PrismLoader />
    </ScrollArea>
  );
}

type Props = {
  type: ContractType;
  setType: Dispatch<SetStateAction<ContractType>>;
};
export default function ContractsCode({ setType, type }: Props) {
  const onTabChange = (value: string) => {
    const val = value as ContractType;
    setType(val);
  };
  return (
    <Tabs
      value={type}
      onValueChange={onTabChange}
      className="grid grid-rows-[auto,1fr]"
    >
      <TabsList className="flex">
        <TabsTrigger value="depo" className="w-full">
          Depository Contract
        </TabsTrigger>
        <TabsTrigger value="token" className="w-full">
          Token Contract
        </TabsTrigger>
        <TabsTrigger value="claim" className="w-full">
          Claims Contract
        </TabsTrigger>
      </TabsList>
      <TabsContent value="depo">
        <ContractScroll code={depositoryContract} />
      </TabsContent>
      <TabsContent value="token">
        <ContractScroll code={tokenContract} />
      </TabsContent>
      <TabsContent value="claim">
        <ContractScroll code={claimContract} />
      </TabsContent>
    </Tabs>
  );
}
