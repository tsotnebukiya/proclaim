import { Button } from "@/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { api } from "@/trpc/react";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";

export function ActionModal({
  tradeRef,
  workspace,
  closeModal,
}: {
  tradeRef: string;
  workspace: string;
  closeModal: () => void;
}) {
  const [hash, setHash] = useState<string>("");

  const claimUtils = api.useUtils().workspace.claims;
  const { mutate, isPending } = api.workspace.claims.attachHash.useMutation({
    onSuccess: () => {
      claimUtils.invalidate();
      closeModal();
      toast.success("Success", {
        description: "Hash attached",
      });
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
  });
  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ hash: hash, tradeRef, workspace });
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Manually attach claim hash</DialogTitle>
      </DialogHeader>
      <form onSubmit={formSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Hash
            </Label>
            <Input
              id="name"
              placeholder="0x3243...253423"
              className="col-span-3"
              onChange={(el) => setHash(el.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" loading={isPending}>
            Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
