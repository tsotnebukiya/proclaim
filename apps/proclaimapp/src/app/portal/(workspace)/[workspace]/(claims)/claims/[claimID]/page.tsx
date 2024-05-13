import IndividualClaim from "@/frontend/components/workspace/individual-claim/individual-claim";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function IndividualClaimPage({
  params,
}: {
  params: {
    claimID: string;
    workspace: string;
  };
}) {
  const { claimID: tradeRef, workspace } = params;
  try {
    const claim = await api.workspace.claims.getClaim({ tradeRef, workspace });
    return (
      <IndividualClaim
        claim={claim}
        tradeRef={tradeRef}
        workspace={workspace}
      />
    );
  } catch (err) {
    notFound();
  }
}
