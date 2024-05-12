import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// 'use client';
import {
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import {
  RiCheckLine,
  RiLock2Fill,
  RiNotification2Line,
  RiSoundModuleLine,
} from "@remixicon/react";
import { cn } from "@/frontend/lib/utils";

const steps = [
  {
    id: 1,
    type: "done",
    title: "Created Workspace",
    description:
      "You successfully created your first workspace in privacy mode",
    activityTime: "3d ago",
  },
  {
    id: 2,
    type: "done",
    title: "Connected database",
    description: "Database connected to MySQL test database",
    activityTime: "2d ago",
  },
  {
    id: 3,
    type: "done",
    title: "Add payment method",
    description: "Payment method for monthly billing added",
    activityTime: "31min ago",
  },
];

const details = [
  { name: "Name", value: "test_workspace" },
  { name: "Storage used", value: "0.25/10GB" },
  { name: "Payment cycle", value: "1st day of month" },
];

export default function AuditTrail() {
  return (
    <Card className="">
      <TabGroup>
        <TabList
          className="flex border-b border-tremor-border bg-tremor-background-muted px-6 pb-4 pt-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background"
          variant="solid"
        >
          <Tab className="w-full justify-center font-medium">Audit Trail</Tab>
          <Tab className="w-full justify-center font-medium">
            Settlement Errors
          </Tab>
        </TabList>

        <TabPanels className="px-6 py-2">
          <TabPanel>
            <ul role="list" className="space-y-6">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className="relative flex gap-x-3">
                  <div
                    className={cn(
                      stepIdx === steps.length - 1 ? "h-6" : "-bottom-6",
                      "absolute left-0 top-0 flex w-6 justify-center",
                    )}
                  >
                    <span
                      className="w-px bg-tremor-border dark:bg-tremor-content-emphasis"
                      aria-hidden={true}
                    />
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-tremor-background dark:bg-dark-tremor-background">
                      {step.type === "done" ? (
                        <RiCheckLine
                          className="h-5 w-5 text-tremor-brand dark:text-dark-tremor-brand"
                          aria-hidden={true}
                        />
                      ) : step.type === "in progress" ? (
                        <div
                          className="h-2.5 w-2.5 rounded-tremor-full bg-tremor-brand ring-4 ring-tremor-background dark:bg-dark-tremor-brand dark:ring-dark-tremor-background"
                          aria-hidden={true}
                        />
                      ) : (
                        <div
                          className="h-3 w-3 rounded-tremor-full border border-tremor-border bg-tremor-background ring-4 ring-tremor-background dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:ring-dark-tremor-background"
                          aria-hidden={true}
                        />
                      )}
                    </div>
                    <div>
                      <p className="mt-0.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {step.title}{" "}
                        <span className="font-normal text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                          &#8729; {step.activityTime}
                        </span>
                      </p>
                      <p className="mt-0.5 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel>
            <List className="rounded-tremor-small bg-tremor-background-muted dark:divide-tremor-content-emphasis dark:bg-dark-tremor-background-subtle">
              <ListItem className="h-10 px-4">
                <span className="text-tremor-content dark:text-dark-tremor-content">
                  Error Type
                </span>
                <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Bank Contract not approved
                </span>
              </ListItem>
            </List>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
