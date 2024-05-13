"use client";

import { Divider } from "@tremor/react";
import { Button, buttonVariants } from "../../ui/button";
import { ChevronLeft, Hash, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/frontend/lib/utils";
import Link from "next/link";
import ClaimDetails from "../cp-claims/claim-details";
import ClaimsDetails from "./claim-details";
import SettlementDetails from "./settlement-details";
import AuditTrail from "./audit-trail";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import ClaimActions from "./actions";

export default function IndividualClaim({
  claim,
  tradeRef,
  workspace,
}: {
  claim: RouterOutput["workspace"]["claims"]["getClaim"];
  tradeRef: string;
  workspace: string;
}) {
  const pathname = usePathname();
  const { data } = api.workspace.claims.getClaim.useQuery(
    { tradeRef, workspace },
    {
      initialData: claim,
    },
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href={pathname.substring(0, pathname.lastIndexOf("/"))}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-9 w-9",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
            Claim #{data.claimInfo.tradeRef}
          </h3>
        </div>

        <div className="flex items-center space-x-4">
          <ClaimActions
            claim={claim}
            tradeRef={tradeRef}
            workspace={workspace}
          />
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid h-full grid-cols-5 gap-8">
        <div className="col-span-3">
          <ClaimsDetails details={data.claimInfo} />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <SettlementDetails details={data.settlementInfo} type={claim.claimInfo.type}/>
          <AuditTrail details={data.auditTrail} />
        </div>
      </div>
    </>
  );
}
