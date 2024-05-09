import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { getCachedContracts } from "@/server/lib/contracts/fetch-contracts";
import { z } from "zod";

export const claimRouter = createTRPCRouter({
  getClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .query(async ({ input }) => {
      const { workspace } = input;
      const claims = await db.claim.findMany({
        where: {
          team: {
            slug: workspace,
          },
        },
      });
      const contracts = await getCachedContracts();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formattedClaims = claims.map((claim) => {
        const {
          id,
          tradeReference: traderef,
          currency: ccy,
          cancelled,
          settled,
          type,
          payDate: paydate,
          amount,
          counterparty,
          market,
          corporateAction: label,
        } = claim;
        let status;
        const payDateObj = new Date(paydate);
        payDateObj.setHours(0, 0, 0, 0);
        if (cancelled) {
          status = "cancelled";
        } else if (payDateObj > today) {
          status = "upcoming";
        } else if (settled) {
          status = "settled";
        } else {
          status = "pending";
        }
        const cp = contracts.find(
          (contract) =>
            `${counterparty}${market}` ===
            `${contract.account}${contract.market}`,
        )?.name!;
        return {
          id,
          traderef,
          ccy: ccy.substring(0, 3),
          status,
          label,
          paydate,
          amount,
          cp,
          type,
        };
      });
      return formattedClaims;
    }),
});
