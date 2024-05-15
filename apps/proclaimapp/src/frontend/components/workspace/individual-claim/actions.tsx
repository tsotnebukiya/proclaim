"use client";

import { Button, buttonVariants } from "../../ui/button";
import { Hash, MoreVertical, Settings2 } from "lucide-react";
import { RouterOutput } from "@/server/api/root";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { Dialog, DialogTrigger } from "@/frontend/components/ui/dialog";
import { ActionModal } from "./modal";
import { useState } from "react";
import { toast } from "sonner";

export default function ClaimActions({
  claim,
  tradeRef,
  workspace,
}: {
  claim: RouterOutput["workspace"]["claims"]["getClaim"];
  tradeRef: string;
  workspace: string;
}) {
  const { type, uploaded } = claim.claimInfo;
  const payable = type === "Payable";
  const { matched, settled } = claim.settlementInfo;
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);
  const claimUtils = api.useUtils().workspace.claims;
  const { mutate: settleClaim } = api.workspace.claims.settleClaim.useMutation({
    onMutate: () => {
      toast.loading("Interacting with Blockchain", { id: "settleToast" });
    },
    onSuccess: (data) => {
      claimUtils.invalidate();
      closeModal();
      toast.success("Success", {
        description: data,
        id: "settleToast",
      });
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
        id: "settleToast",
      });
    },
  });
  const { mutate: updateStatus } =
    api.workspace.claims.updateStatus.useMutation({
      onMutate: () => {
        toast.loading("Interacting with Blockchain", { id: "updateToast" });
      },
      onSuccess: (data) => {
        claimUtils.invalidate();
        toast.success("Success", {
          description: data,
          id: "updateToast",
        });
      },
      onError: (err) => {
        toast.error("Error", {
          description: err.message,
          id: "updateToast",
        });
      },
    });
  const { mutate: uploadClaim } = api.workspace.claims.uploadClaim.useMutation({
    onMutate: () => {
      toast.loading("Interacting with Blockchain", { id: "uploadToast" });
    },
    onSuccess: (data) => {
      claimUtils.invalidate();
      closeModal();
      toast.success("Success", {
        description: data,
        id: "uploadToast",
      });
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
        id: "uploadToast",
      });
    },
  });
  const handleSettle = () => {
    settleClaim({ tradeRef, workspace });
  };
  const handleUpdate = () => {
    updateStatus({ tradeRef, workspace });
  };
  const handleUpload = () => {
    uploadClaim({ tradeRef, workspace });
  };
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="h-9 w-9">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!settled && payable ? (
            <DropdownMenuItem onClick={handleSettle}>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Settle Claim</span>
            </DropdownMenuItem>
          ) : null}
          {!settled ? (
            <DropdownMenuItem onClick={handleUpdate}>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Update Status</span>
            </DropdownMenuItem>
          ) : null}
          {!matched && payable ? (
            <DialogTrigger>
              <DropdownMenuItem>
                <Hash className="mr-2 h-4 w-4" />
                <span>Attach Hash</span>
              </DropdownMenuItem>
            </DialogTrigger>
          ) : null}
          {!payable && !uploaded ? (
            <DropdownMenuItem onClick={handleUpload}>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Upload Claim</span>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <ActionModal
        tradeRef={tradeRef}
        workspace={workspace}
        closeModal={closeModal}
      />
    </Dialog>
  );
}
