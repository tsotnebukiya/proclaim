"use client";

import { Divider } from "@tremor/react";

import { Separator } from "../ui/separator";
import { CandlestickChart, CreditCard } from "lucide-react";
import { Badge } from "../ui/badge";
import { TransactionsTable } from "./transactions-table";
import { RouterOutput } from "@/server/api/root";

type FundingData = RouterOutput["funding"]["getGeneralData"];

export default function TokenStats({
  generalData,
  transfers,
  ccy,
}: {
  ccy: string;
  generalData: FundingData["generalData"];
  transfers: FundingData["transfers"];
}) {
  const { todayBalance, yesterdayBalance, todayVolume, yesterdayVolume } =
    generalData;
  let balanceChange = 0;
  if (yesterdayBalance) {
    balanceChange =
      ((todayBalance - yesterdayBalance) / yesterdayBalance) * 100;
  }
  const volumeChange =
    ((todayVolume - yesterdayVolume) / yesterdayVolume) * 100;
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[1fr,min-content,1fr]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CreditCard />
              <span className="text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                BALANCE
              </span>
            </div>
            <span className="text-tremor-metric font-bold text-tremor-brand-muted dark:text-dark-tremor-brand-muted">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: ccy === "usd" ? "usd" : "eur",
              }).format(Number(todayBalance))}
            </span>
          </div>
          <div className="flex justify-between">
            <Badge variant={balanceChange < 0 ? "destructive" : "default"}>
              {balanceChange.toFixed(2)}%
            </Badge>
          </div>
        </div>
        <Separator orientation="vertical" className="mx-8" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CandlestickChart />
              <span className="text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                VOLUME
              </span>
            </div>
            <span className="text-tremor-metric font-bold text-tremor-brand-muted dark:text-dark-tremor-brand-muted">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: ccy === "usd" ? "usd" : "eur",
              }).format(Number(todayVolume))}
            </span>
          </div>
          <div className="flex justify-between">
            {todayVolume === 0 ? (
              <Badge variant={"outline"}>0%</Badge>
            ) : (
              <Badge variant={volumeChange < 0 ? "destructive" : "default"}>
                {volumeChange.toFixed(2)}%
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <TransactionsTable transfers={transfers} />
      </div>
    </div>
  );
}
