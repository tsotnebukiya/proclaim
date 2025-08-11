"use client";

import { Search } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { cn, shortenAddress } from "@/frontend/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { ContractType } from "./contracts-list";
import { List, ListItem } from "@tremor/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { RouterOutput } from "@/server/api/root";
import { Switch } from "../ui/switch";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type BlockProps = {
  item: RouterOutput["contract"]["getContracts"][number];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<ContractType>>;
  refetchHandler: () => Promise<void>;
};

function Block({
  item,
  selected,
  setSelected,
  setType,
  refetchHandler,
}: BlockProps) {
  const { mutate, isPending } = api.contract.approveContractToken.useMutation({
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
    onSuccess: async (data) => {
      refetchHandler();
      toast.success("Success", {
        description: `Token transfer ${data ? "" : "un"}approved`,
      });
    },
  });
  const onCheckChange = (ccy: string) => {
    const currentState = item.ccyApproved?.find(
      (el) => el.ccy === ccy,
    )?.approved!;
    mutate({
      address: item.contractAddress,
      ccy,
      approve: !currentState,
    });
  };
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        selected === item.contractAddress && "bg-muted",
      )}
      onClick={() => {
        setSelected(item.contractAddress);
        setType(item.type);
      }}
    >
      <div className="flex w-full items-center justify-between space-x-2">
        <h4 className="truncate text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          <div className="focus:outline-none">{item.name}</div>
        </h4>
      </div>
      <List className="mt-3 divide-none">
        <ListItem className="justify-start space-x-2 py-1">
          <span>Deployer:</span>
          <Link
            target="_blank"
            href={`https://explorer.stavanger.gateway.fm/address/${item.deployerAddress}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-fit p-0 text-foreground",
            )}
          >
            {item.deployer}
          </Link>
        </ListItem>
        <ListItem className="justify-start space-x-2 py-1">
          <span>Contract Address:</span>
          <Link
            target="_blank"
            href={`https://explorer.stavanger.gateway.fm/address/${item.contractAddress}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-fit p-0 text-foreground",
            )}
          >
            {shortenAddress(item.contractAddress)}
          </Link>
        </ListItem>
        {item.holders && (
          <ListItem className="justify-start space-x-2 py-1">
            <span>№ of Holders:</span>
            <span className={cn("text-foreground")}>{item.holders}</span>
          </ListItem>
        )}
        {item.totalSupply && (
          <ListItem className="justify-start space-x-2 py-1">
            <span>Total Supply:</span>
            <span className={cn("text-foreground")}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: item.name === "USDtToken" ? "usd" : "eur",
              }).format(Number(item.totalSupply) / 100)}
            </span>
          </ListItem>
        )}
        {item.market && (
          <ListItem className="justify-start space-x-2 py-1">
            <span>Market:</span>
            <span className={cn("text-foreground")}>{item.market}</span>
          </ListItem>
        )}
        {item.market && (
          <ListItem className="justify-start space-x-2 py-1">
            <span>Account:</span>
            <span className={cn("text-foreground")}>{item.account}</span>
          </ListItem>
        )}
        {item.ccyApproved && (
          <ListItem className="flex items-baseline space-x-2 py-1">
            <div>Token Transfer:</div>
            <div className="flex flex-1 justify-around">
              {item.ccyApproved.map((el) => (
                <div className="flex  flex-col items-center gap-2">
                  <div className="font-medium text-foreground">{el.ccy}</div>
                  <div>
                    <Switch
                      checked={el.approved}
                      disabled={isPending}
                      onCheckedChange={() => onCheckChange(el.ccy)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ListItem>
        )}
      </List>
    </div>
  );
}

type Props = {
  items: RouterOutput["contract"]["getContracts"];
  setType: Dispatch<SetStateAction<ContractType>>;
  refetchHandler: () => Promise<void>;
};

export default function ContractBlocks({
  items,
  setType,
  refetchHandler,
}: Props) {
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((el) =>
    search.length > 0
      ? el.deployer.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      : true,
  );
  const depoItems = filteredItems.filter((el) => el.type === "depo");
  const tokenItems = filteredItems.filter((el) => el.type === "token");
  const ourClaimItems = filteredItems.filter(
    (el) => el.type === "claim" && !el.cp,
  );
  const cpClaimItems = filteredItems.filter(
    (el) => el.type === "claim" && el.cp,
  );
  const [selected, setSelected] = useState(filteredItems[0]?.contractAddress!);
  return (
    <div className="grid grid-rows-[auto_1fr] gap-6">
      <div className="backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            onChange={(el) => setSearch(el.target.value)}
          />
        </div>
      </div>
      <ScrollArea>
        {depoItems.length > 0 && (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="mb-4 w-fit items-center rounded bg-blue-100 px-1.5 py-0.5 text-tremor-title font-medium text-blue-800 ">
                Depository
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {depoItems.map((item) => (
                  <Block
                    refetchHandler={refetchHandler}
                    key={item.contractAddress}
                    item={item}
                    selected={selected}
                    setSelected={setSelected}
                    setType={setType}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {tokenItems.length > 0 && (
          <div>
            <h4 className=" mb-4 w-fit items-center rounded bg-emerald-100 px-1.5 py-0.5 text-tremor-title font-medium text-emerald-800 ">
              Tokens
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {tokenItems.map((item) => (
                <Block
                  refetchHandler={refetchHandler}
                  key={item.contractAddress}
                  item={item}
                  selected={selected}
                  setSelected={setSelected}
                  setType={setType}
                />
              ))}
            </div>
          </div>
        )}

        {ourClaimItems.length > 0 && (
          <div>
            <h4 className=" text-title mb-4 w-fit items-center rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800 ">
              Our Claims
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {ourClaimItems
                .sort((a, b) => a.deployer.localeCompare(b.deployer))
                .map((item) => (
                  <Block
                    refetchHandler={refetchHandler}
                    key={item.contractAddress}
                    item={item}
                    selected={selected}
                    setSelected={setSelected}
                    setType={setType}
                  />
                ))}
            </div>
          </div>
        )}
        {cpClaimItems.length > 0 && (
          <div>
            <h4 className=" text-title mb-4 w-fit items-center rounded bg-indigo-100 px-1.5 py-0.5 font-medium text-indigo-800 ">
              Counterparty Claims
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {cpClaimItems
                .sort((a, b) => a.deployer.localeCompare(b.deployer))
                .map((item) => (
                  <Block
                    key={item.contractAddress}
                    item={item}
                    selected={selected}
                    setSelected={setSelected}
                    setType={setType}
                    refetchHandler={refetchHandler}
                  />
                ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
