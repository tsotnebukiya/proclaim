import { RiExternalLinkLine, RiFileLine } from "@remixicon/react";

import {
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { Button } from "../../ui/button";
import EventHistory from "./event-history";

const bills = [
  {
    id: 1,
    month: "Sept 23",
    status: "unpaid",
    href: "#",
  },
  {
    id: 2,
    month: "Aug 23",
    status: "paid",
    href: "#",
  },
  {
    id: 3,
    month: "Jul 23",
    status: "paid",
    href: "#",
  },
];

export default function UploadTab() {
  return (
    <div className="mt-8">
      <div className="rounded-tremor-small bg-tremor-background-muted p-6 ring-1 ring-inset ring-tremor-ring dark:bg-dark-tremor-background-muted dark:ring-dark-tremor-ring">
        <h4 className="text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Manually trigger event
        </h4>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          After triggering Proclaim will upload all receivable claims to smart
          contract
        </p>
        <div className="mt-6 flex items-center space-x-2">
          <Button>Trigger Event</Button>
        </div>
      </div>
      <EventHistory/>
    </div>
  );
}
