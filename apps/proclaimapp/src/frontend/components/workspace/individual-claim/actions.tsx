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
    onSuccess: (data) => {
      claimUtils.invalidate();
      closeModal();
      toast.success("Success", {
        description: data,
      });
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
  });
  const { mutate: uploadClaim } = api.workspace.claims.uploadClaim.useMutation({
    onSuccess: (data) => {
      claimUtils.invalidate();
      closeModal();
      toast.success("Success", {
        description: data,
      });
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
  });
  const handleSettle = () => {
    settleClaim({ tradeRef, workspace });
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
