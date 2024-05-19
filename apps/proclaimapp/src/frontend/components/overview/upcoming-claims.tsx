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
    color: "bg-cyan-500",
  },
  {
    name: "IT & equipment",
    amount: 4120,
    share: "19.6%",
    color: "bg-blue-500",
  },
  {
    name: "Training & development",
    amount: 3920,
    share: "18.6%",
    color: "bg-indigo-500",
  },
  {
    name: "Office supplies",
    amount: 3210,
    share: "15.3%",
    color: "bg-violet-500",
  },
  {
    name: "Communication",
    amount: 3010,
    share: "14.3%",
    color: "bg-fuchsia-500",
  },
];

const dataByEmployee = [
  {
    name: "Max Down",
    amount: 5710,
    share: "27.2%",
    color: "bg-cyan-500",
  },
  {
    name: "Lena Smith",
    amount: 4940,
    share: "23.5%",
    color: "bg-blue-500",
  },
  {
    name: "Joe Doe",
    amount: 4523,
    share: "21.5%",
    color: "bg-indigo-500",
  },
  {
    name: "Kathy Miller",
    amount: 3240,
    share: "15.4%",
    color: "bg-violet-500",
  },
  {
    name: "Nelly Wave",
    amount: 2577,
    share: "12.3%",
    color: "bg-fuchsia-500",
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

type ClaimsData = RouterOutput["overview"]["getData"]["claims"];

const prepareData = (
  claims: ClaimsData,
  period: "tomorrow" | "wholeWeek" | "wholeMonth",
  category: "byCounterparty" | "byCorporateAction",
) => {
  const cat = claims[category]!;
  const data = cat[period];
  return Object.keys(data).map((key) => {
    const groupData = data[key];
    if (!groupData) {
      return {
        name: key,
        amount: 0,
        share: "0%",
        color: "bg-gray-500", // Assign a default color for undefined data
      };
    }
    return {
      name: key,
      amount: groupData.totalAmount,
      share: (groupData.share * 100).toFixed(2) + "%",
      color: "bg-cyan-500", // Assign a default color; you may want to handle colors dynamically
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
        <div className="flex items-center justify-between px-6 pt-6">
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
