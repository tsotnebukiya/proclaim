"use client";
import { cn } from "@/frontend/lib/utils";
import {
  Card,
  DonutChart,
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RouterOutput } from "@/server/api/root";
import { useState } from "react";

const dataByCategory = [
  {
    name: "Travel",
    amount: 6730,
    share: "32.1%",
    color: "bg-[hsl(var(--chart-2))]",
  },
  {
    name: "IT & equipment",
    amount: 4120,
    share: "19.6%",
    color: "bg-[hsl(var(--chart-1))]",
  },
  {
    name: "Training & development",
    amount: 3920,
    share: "18.6%",
    color: "bg-[hsl(var(--chart-3))]",
  },
  {
    name: "Office supplies",
    amount: 3210,
    share: "15.3%",
    color: "bg-[hsl(var(--chart-4))]",
  },
  {
    name: "Communication",
    amount: 2510,
    share: "12.0%",
    color: "bg-[hsl(var(--chart-5))]",
  },
];

const dataByEmployee = [
  {
    name: "Emma Thompson",
    amount: 6390,
    share: "30.4%",
    color: "bg-[hsl(var(--chart-2))]",
  },
  {
    name: "Liam Johnson",
    amount: 4560,
    share: "21.7%",
    color: "bg-[hsl(var(--chart-1))]",
  },
  {
    name: "Olivia Davis",
    amount: 3980,
    share: "18.9%",
    color: "bg-[hsl(var(--chart-3))]",
  },
  {
    name: "Noah Wilson",
    amount: 3210,
    share: "15.3%",
    color: "bg-[hsl(var(--chart-4))]",
  },
  {
    name: "Ava Brown",
    amount: 2860,
    share: "13.6%",
    color: "bg-[hsl(var(--chart-5))]",
  },
];

// const summary = [
//   {
//     name: "Counterparty",
//     data: dataByCategory,
//   },
//   {
//     name: "Type",
//     data: dataByEmployee,
//   },
// ];

const currencyFormatter = (number: number) => {
  return "$" + Intl.NumberFormat("us").format(number).toString();
};

// Chart color classes that work with our CSS variables
const chartColorClasses = [
  "bg-[hsl(var(--chart-2))]", // cyan
  "bg-[hsl(var(--chart-1))]", // blue
  "bg-[hsl(var(--chart-3))]", // indigo
  "bg-[hsl(var(--chart-4))]", // violet
  "bg-[hsl(var(--chart-5))]", // fuchsia
];

const chartColors = ["cyan", "blue", "indigo", "violet", "fuchsia"];

type ClaimsData = RouterOutput["overview"]["getData"]["claims"];

const prepareData = (
  claims: ClaimsData,
  period: "tomorrow" | "wholeWeek" | "wholeMonth",
  category: "byCounterparty" | "byCorporateAction",
) => {
  const cat = claims[category]!;
  const data = cat[period];
  return Object.keys(data).map((key, index) => {
    const groupData = data[key];
    if (!groupData) {
      return {
        name: key,
        amount: 0,
        share: "0%",
        color: chartColorClasses[0], // Default color
      };
    }
    return {
      name: key,
      amount: groupData.totalAmount,
      share: (groupData.share * 100).toFixed(2) + "%",
      color: chartColorClasses[index % chartColorClasses.length],
    };
  });
};
const colors = ["cyan", "blue", "indigo", "violet", "fuchsia"];
export default function UpcomingClaims({
  data,
}: {
  data: RouterOutput["overview"]["getData"]["claims"];
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "tomorrow" | "wholeWeek" | "wholeMonth"
  >("tomorrow");
  const [selectedCategory, setSelectedCategory] = useState("byCounterparty");
  const summary = [
    {
      name: "Counterparty",
      key: "byCounterparty",
    },
    {
      name: "Corporate Action",
      key: "byCorporateAction",
    },
  ];
  const handlePeriodChange = (
    value: "tomorrow" | "wholeWeek" | "wholeMonth",
  ) => {
    setSelectedPeriod(value);
  };
  return (
    <>
      <Card className="p-0 sm:mx-auto">
        <div className="flex items-center justify-between px-6 pt-4">
          <h3 className=" text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Upcoming Claims
          </h3>
          <Select
            defaultValue={selectedPeriod}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"tomorrow"}>Tomorrow</SelectItem>
              <SelectItem value={"wholeWeek"}>Week</SelectItem>
              <SelectItem value={"wholeMonth"}>Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabGroup>
          <TabList className="px-6 pt-4">
            {summary.map((category) => (
              <Tab
                key={category.name}
                onClick={() => setSelectedCategory(category.key)}
              >
                By {category.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="px-6 pb-6">
            {summary.map((category) => (
              <TabPanel key={category.name}>
                <DonutChart
                  className="mt-8"
                  data={prepareData(
                    data,
                    selectedPeriod,
                    category.key as "byCounterparty" | "byCorporateAction",
                  )}
                  category="amount"
                  index="name"
                  valueFormatter={currencyFormatter}
                  showTooltip={false}
                  colors={colors} // Assign colors as needed
                />
                <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                  <span>{category.name}</span>
                  <span>Amount / Share</span>
                </p>
                <List className="mt-2">
                  {prepareData(
                    data,
                    selectedPeriod,
                    category.key as "byCounterparty" | "byCorporateAction",
                  ).map((item, i) => (
                    <ListItem key={item.name} className="space-x-6">
                      <div className="flex items-center space-x-2.5 truncate">
                        <span
                          className={cn(
                            `bg-${colors[i]}-500`,
                            "h-2.5 w-2.5 shrink-0 rounded-sm",
                          )}
                          aria-hidden={true}
                        />
                        <span className="truncate dark:text-dark-tremor-content-emphasis">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {currencyFormatter(item.amount)}
                        </span>
                        <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                          {item.share}
                        </span>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Card>
    </>
  );
}
