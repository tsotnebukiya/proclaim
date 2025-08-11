// 'use client';
import {
  Card,
  CategoryBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import { RiExternalLinkLine } from "@remixicon/react";
import { cn, customNumberFormatter } from "@/frontend/lib/utils";
import { RouterOutput } from "@/server/api/root";

function Chart({
  data,
}: {
  data: RouterOutput["overview"]["getData"]["groupedType"]["payable"];
}) {
  return (
    <div>
      <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        Volume
      </h4>

      <p className="mt-1 text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(data.totalAmount)}
      </p>
      <CategoryBar
        values={[
          data.settledPercentage,
          data.pendingPercentage,
          data.upcomingPercentage,
        ]}
        colors={["blue", "cyan", "fuchsia"]}
        showLabels={false}
        className="mt-6"
      />
      <ul
        role="list"
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <li className="flex items-center space-x-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: "hsl(var(--chart-1))" }}
            aria-hidden={true}
          />
          <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            <span className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              {customNumberFormatter(data.settled, 0)}
            </span>{" "}
            settled
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: "hsl(var(--chart-2))" }}
            aria-hidden={true}
          />
          <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            <span className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              {customNumberFormatter(data.pending, 0)}
            </span>{" "}
            outstanding
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: "hsl(var(--chart-5))" }}
            aria-hidden={true}
          />
          <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            <span className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              {customNumberFormatter(data.upcoming, 0)}
            </span>{" "}
            upcoming
          </span>
        </li>
      </ul>
    </div>
  );
}

export default function ChartComposition({
  data,
}: {
  data: RouterOutput["overview"]["getData"]["groupedType"];
}) {
  return (
    <Card>
      <TabGroup defaultIndex={0}>
        <TabList className="mb-10">
          <Tab>Receivable</Tab>
          <Tab>Payable</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Chart data={data.receivable} />
          </TabPanel>
          <TabPanel>
            <Chart data={data.payable} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
