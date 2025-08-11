// 'use client';
import { cn } from "@/frontend/lib/utils";
import {
  RiAddCircleFill,
  RiCheckboxCircleFill,
  RiGitMergeFill,
  RiGitPullRequestFill,
} from "@remixicon/react";
import { BarChart, Card, CategoryBar, Divider } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RouterOutput } from "@/server/api/root";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type ReceivedData = RouterOutput["overview"]["getData"]["oldClaims"];

export default function SettledPending({ data }: { data: ReceivedData }) {
  const [selectedDate, setSelectedDate] = useState<keyof ReceivedData>("today");
  const handlePeriodChange = (val: keyof ReceivedData) => {
    setSelectedDate(val);
  };
  const currentData = data[selectedDate];
  const lendingTotal =
    currentData.settled.lending + currentData.pending.lending;
  const caTotal = currentData.settled.ca + currentData.pending.ca;

  const displayedData = [
    {
      name: "Settled",
      value: currentData.settled.lending,
      icon: RiCheckboxCircleFill,
      iconColor: "text-emerald-500",
    },
    {
      name: "Pending",
      value: currentData.pending.lending,
      icon: QuestionMarkCircledIcon,
      iconColor: "text-yellow-500",
    },
    {
      name: "Settled",
      value: currentData.settled.ca,
      icon: RiCheckboxCircleFill,
      iconColor: "text-emerald-500",
    },
    {
      name: "Pending",
      value: currentData.pending.ca,
      icon: QuestionMarkCircledIcon,
      iconColor: "text-yellow-500",
    },
  ];
  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-tremor-border bg-tremor-background-muted px-6 py-4 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
          <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Settled/Pending
          </h3>
          <Select
            defaultValue={selectedDate}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"today" as keyof ReceivedData}>
                Today
              </SelectItem>
              <SelectItem value={"yesterday" as keyof ReceivedData}>
                Yesterday
              </SelectItem>
              <SelectItem value={"twoDaysAgo" as keyof ReceivedData}>
                2d ago
              </SelectItem>
              <SelectItem value={"threeDaysAgo" as keyof ReceivedData}>
                3d ago
              </SelectItem>
              <SelectItem value={"fourDaysAgo" as keyof ReceivedData}>
                4d ago
              </SelectItem>
              <SelectItem value={"fiveDaysAgo" as keyof ReceivedData}>
                5d ago
              </SelectItem>
              <SelectItem value={"sixDaysAgo" as keyof ReceivedData}>
                6d ago
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <CategoryBar
              showLabels={false}
              values={[
                (currentData.settled.lending / lendingTotal) * 100,
                (currentData.pending.lending / lendingTotal) * 100,
              ]}
              colors={["emerald", "yellow"]}
            />
            <p className="mt-2 text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">
              <span className="font-semibold">{lendingTotal}</span> Lending
              Claims
            </p>
          </div>
          <div>
            <CategoryBar
              showLabels={false}
              values={[
                (currentData.settled.ca / caTotal) * 100,
                (currentData.pending.ca / caTotal) * 100,
              ]}
              colors={["emerald", "yellow"]}
            />
            <p className="mt-2 text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">
              <span className="font-semibold">{caTotal}</span> CA Claims
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-px border-t border-tremor-border bg-tremor-border dark:border-dark-tremor-border dark:bg-dark-tremor-border md:grid-cols-4">
          {displayedData.map((item) => (
            <li
              key={item.name}
              className="flex flex-col items-center justify-center bg-tremor-background p-3 dark:bg-tremor-background"
            >
              <div className="flex items-center space-x-1">
                <item.icon
                  className={cn(item.iconColor, "h-5 w-5")}
                  aria-hidden={true}
                />
                <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {item.value}
                </span>
              </div>
              <span className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
