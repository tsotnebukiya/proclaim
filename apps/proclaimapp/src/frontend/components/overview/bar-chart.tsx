// 'use client';
import { cn } from "@/frontend/lib/utils";
import { RouterOutput } from "@/server/api/root";
import { BarChart, Card } from "@tremor/react";

const tabs = [
  { name: "Europe", value: "$1.9M", color: "bg-blue-500" },
  { name: "Asia", value: "$4.1M", color: "bg-cyan-500" },
  { name: "North America", value: "$10.1M", color: "bg-indigo-500" },
];

const data = [
  {
    date: "Jan",
    Europe: 68560,
    Asia: 28560,
    "North America": 34940,
  },
  {
    date: "Feb",
    Europe: 70320,
    Asia: 30320,
    "North America": 44940,
  },
  {
    date: "Mar",
    Europe: 80233,
    Asia: 70233,
    "North America": 94560,
  },
  {
    date: "Apr",
    Europe: 55123,
    Asia: 45123,
    "North America": 84320,
  },
  {
    date: "May",
    Europe: 56000,
    Asia: 80600,
    "North America": 71120,
  },
  {
    date: "Jun",
    Europe: 100000,
    Asia: 85390,
    "North America": 61340,
  },
  {
    date: "Jul",
    Europe: 85390,
    Asia: 45340,
    "North America": 71260,
  },
  {
    date: "Aug",
    Europe: 80100,
    Asia: 70120,
    "North America": 61210,
  },
  {
    date: "Sep",
    Europe: 75090,
    Asia: 69450,
    "North America": 61110,
  },
  {
    date: "Oct",
    Europe: 71080,
    Asia: 63345,
    "North America": 41430,
  },
  {
    date: "Nov",
    Europe: 68041,
    Asia: 61210,
    "North America": 100330,
  },
  {
    date: "Dec",
    Europe: 60143,
    Asia: 45321,
    "North America": 80780,
  },
];

function valueFormatter(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "USD",
  });

  return formatter.format(number);
}

export default function BarChartComponent({
  data,
}: {
  data: RouterOutput["overview"]["getData"]["barStats"];
}) {
  const { barChartData, totalValues, topCounterpartyNames } = data;
  return (
    <>
      <Card className="sm:mx-auto">
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Claims breakdown by counterparties
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Check claims of top 3 CPs over time
        </p>
        <ul
          role="list"
          className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3"
        >
          {totalValues.map((tab) => (
            <li
              key={tab.name}
              className="rounded-tremor-small border border-tremor-border px-3 py-2 text-left dark:border-dark-tremor-border"
            >
              <div className="flex items-center space-x-1.5">
                <span
                  className={cn(tab.color, "h-2.5 w-2.5 rounded-sm")}
                  aria-hidden={true}
                />
                <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                  {tab.name}
                </p>
              </div>
              <p className="mt-0.5 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {tab.value}
              </p>
            </li>
          ))}
        </ul>
        <BarChart
          data={barChartData.reverse()}
          index="date"
          categories={topCounterpartyNames}
          colors={["blue", "cyan", "indigo"]}
          showLegend={false}
          valueFormatter={valueFormatter}
          yAxisWidth={45}
          stack={true}
          className="mt-6 hidden h-56 sm:block"
        />
      </Card>
    </>
  );
}
