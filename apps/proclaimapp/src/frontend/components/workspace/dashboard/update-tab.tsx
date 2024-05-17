import { Button } from "../../ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export default function UpdateTab({ workspace }: { workspace: string }) {
  const claimUtils = api.useUtils().workspace.dashboard;
  const { mutate, isPending } =
    api.workspace.dashboard.updateClaims.useMutation({
      onMutate: () => {
        toast.loading("Interacting with Blockchain", {
          id: "updatingClaims",
          description: "",
        });
        claimUtils.getData.invalidate();
      },
      onSuccess: (res) => {
        toast.success("Success", {
          description: `Claims status updated`,
          id: "updatingClaims",
        });
      },
      onError: (err) => {
        toast.error("Error", {
          description: err.message,
          id: "updatingClaims",
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
          Update Claims Status
        </h4>
        <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          After triggering Proclaim will fetch blockchain to update status of
          claims
        </p>
        <div className="mt-6 flex items-center space-x-2">
          <Button onClick={clickHandler} loading={isPending}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
