import { api } from "@/trpc/react";
import { Button } from "../../ui/button";
import { toast } from "sonner";

export default function SettleTab({ workspace }: { workspace: string }) {
  const claimUtils = api.useUtils().workspace.dashboard;
  const { mutate, isPending } =
    api.workspace.dashboard.settleClaims.useMutation({
      onMutate: () => {
        toast.loading("Interacting with blockchain", {
          id: "settleClaims",
          description: "",
        });
        claimUtils.getData.invalidate();
      },
      onSuccess: (res) => {
        toast.success("Success", {
          description: `Matching claims settled`,
          id: "settleClaims",
        });
      },
      onError: (err) => {
        toast.error("Error", {
          description: err.message,
          id: "settleClaims",
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
          Settle claims on Blockchain
        </h4>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          After triggering Proclaim will fetch CP claims from blockchain and
          settle matching ones
        </p>
        <div className="mt-6 flex items-center space-x-2">
          <Button onClick={clickHandler} loading={isPending}>
            Settle
          </Button>
        </div>
      </div>
    </div>
  );
}
