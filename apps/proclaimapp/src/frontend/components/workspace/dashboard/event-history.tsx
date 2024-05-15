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

import { RiExternalLinkLine, RiFileLine } from "@remixicon/react";
import SettleTab from "./settle-tab";
import UploadTab from "./upload-tab";
import UpdateTab from "./update-tab";

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

export default function EventHistory() {
  return (
    <div className="mt-10">
      <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Event history
      </h4>
      <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        See previous events
      </p>
      <List className="mt-4">
        <ListItem className="grid grid-cols-3 px-2 py-2.5">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
              Date
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
              Type
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
              Scope
            </span>
          </div>
        </ListItem>
        {bills.map((item) => (
          <ListItem key={item.id} className="grid grid-cols-3 px-2 py-2.5">
            <div className="flex items-center space-x-3">
              <span className=" text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
                Date
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className=" text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
                Type
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className=" text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
                Scope
              </span>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
