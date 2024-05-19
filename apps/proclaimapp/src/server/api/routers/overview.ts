import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  getBarChartData,
  groupClaimsByTypeAndStatus,
  groupOld,
  groupUpcoming,
} from "@/server/lib/claims/getDashboardStats";
import { getCachedContracts } from "@/server/lib/contracts/fetch-contracts";
import { claimStatus, convertToUSD } from "@/server/lib/utils";

export const overviewRouter = createTRPCRouter({
  getData: publicProcedure.query(async () => {
    const claims = await db.claim.findMany();
    const totalVolume = claims.reduce(
      (prev, curr) => prev + convertToUSD(curr.amount, curr.currency),
      0,
    );
    const contracts = await getCachedContracts();
    const totalCount = claims.length;
    const outstandingCount = claims.filter(
      (el) => claimStatus(el.payDate, el.settled) === "pending",
    ).length;
    const upcomingCount = claims.filter(
      (el) => claimStatus(el.payDate, el.settled) === "upcoming",
    ).length;
    const barStats = getBarChartData(claims, contracts);
    const groupedType = groupClaimsByTypeAndStatus(claims);
    const oldClaims = groupOld(claims, contracts);
    const { byCorporateAction, byCounterparty } = groupUpcoming(
      claims.filter((claim) => !claim.settled),
      contracts,
    );
    const returnObject = {
      kpi: {
        totalVolume,
        totalCount,
        outstandingCount,
        upcomingCount,
      },
      claims: {
        byCorporateAction,
        byCounterparty,
      },
      oldClaims,
      barStats,
      groupedType,
    };
    return returnObject;
  }),
});
