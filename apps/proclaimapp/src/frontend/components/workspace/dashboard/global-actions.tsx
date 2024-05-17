// 'use client';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";

import SettleTab from "./settle-tab";
import UploadTab from "./upload-tab";
import UpdateTab from "./update-tab";
import { EventHistory } from "./event-history";
import { RouterOutput } from "@/server/api/root";

export default function GlobalEvents({
  data,
  workspace,
}: {
  data: RouterOutput["workspace"]["dashboard"]["getData"]["events"];
  workspace: string;
}) {
  return (
    <>
      <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
        Global Events
      </h3>
      <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
        Manage and view events, analytics
      </p>
      <TabGroup defaultIndex={0} className="mt-6">
        <TabList>
          <Tab>Settle Payable</Tab>
          <Tab>Upload Receivable</Tab>
          <Tab>Update Status</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SettleTab workspace={workspace} />
          </TabPanel>
          <TabPanel>
            <UploadTab workspace={workspace} />
          </TabPanel>
          <TabPanel>
            <UpdateTab workspace={workspace} />
          </TabPanel>
        </TabPanels>
        <EventHistory events={data} />
      </TabGroup>
    </>
  );
}
