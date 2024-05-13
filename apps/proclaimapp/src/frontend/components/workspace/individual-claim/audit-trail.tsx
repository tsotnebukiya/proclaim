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
import { RouterOutput } from "@/server/api/root";
import moment from "moment-timezone";

export default function AuditTrail({
  details,
}: {
  details: RouterOutput["workspace"]["claims"]["getClaim"]["auditTrail"];
}) {
  const { audit, errors } = details;
  const {
    createdDate,
    createdBy,
    settledBy,
    creatorName,
    settled,
    settledDate,
    settlerName,
  } = audit;
  const systemCreated = createdBy === "SYSTEM";
  const systemSettled = settledBy === "SYSTEM";
  const steps = [
    {
      id: 1,
      type: "done",
      title: "Creation",
      description: `Claim created by ${systemCreated ? "SYSTEM" : creatorName}`,
      activityTime: moment(createdDate).fromNow(),
    },
    {
      id: 2,
      type: settled ? "done" : "",
      title: "Settlement",
      description: settled
        ? `Claim settled by ${systemSettled ? "SYSTEM" : settlerName}`
        : "Pending settlement",
      activityTime: settled ? moment(settledDate).fromNow() : "",
    },
  ];
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
                          &#8729; {step.activityTime!}
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
            {errors[0] ? (
              <List className="">
                {errors.map((el, i) => (
                  <ListItem key={i} className="">
                    <span className="text-tremor-content dark:text-dark-tremor-content">
                      Error Type
                    </span>
                    <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {el.reason}
                    </span>
                  </ListItem>
                ))}
              </List>
            ) : (
              <span className="text-tremor-content">No Errors</span>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
