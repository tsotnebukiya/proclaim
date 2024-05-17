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
import { api } from "@/trpc/react";
import { toast } from "sonner";

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

export default function UploadTab({ workspace }: { workspace: string }) {
  const claimUtils = api.useUtils().workspace.dashboard;
  const { mutate, isPending } =
    api.workspace.dashboard.uploadClaims.useMutation({
      onMutate: () => {
        toast.loading("Interacting with Blockchain", {
          id: "uploadClaims",
          description: "",
        });
        claimUtils.getData.invalidate();
      },
      onSuccess: (res) => {
        toast.success("Success", {
          description: `Claims uploaded`,
          id: "uploadClaims",
        });
      },
      onError: (err) => {
        toast.error("Error", {
          description: err.message,
          id: "uploadClaims",
        });
      },
    });
  const clickHandler = () => {
    mutate({ workspace });
  };
  return (
    <div className="mt-8">
      <div className="rounded-tremor-small bg-tremor-background-muted p-6 ring-1 ring-inset ring-tremor-ring dark:bg-dark-tremor-background-muted dark:ring-dark-tremor-ring">
        <h4 className="text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Upload Claims to Blockchain
        </h4>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          After triggering Proclaim will upload all receivable claims to smart
          contract
        </p>
        <div className="mt-6 flex items-center space-x-2">
          <Button onClick={clickHandler} loading={isPending}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
