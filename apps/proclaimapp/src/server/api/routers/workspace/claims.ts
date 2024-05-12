import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { getCachedContracts } from "@/server/lib/contracts/fetch-contracts";
import { claimStatus } from "@/server/lib/utils";
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
        orderBy: {
          payDate: "desc",
        },
      });
      const contracts = await getCachedContracts();

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
          matched,
        } = claim;

        const status = claimStatus(paydate, settled);
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
  getClaim: publicProcedure
    .input(z.object({ tradeRef: z.string(), workspace: z.string() }))
    .query(async ({ input }) => {
      const { tradeRef, workspace } = input;
      const claimPromise = db.claim.findUniqueOrThrow({
        where: {
          tradeReference: tradeRef,
          team: {
            slug: workspace,
          },
        },
        include: {
          creator: true,
          settler: true,
          settlementError: true,
        },
      });
      const contractsPromise = getCachedContracts();
      const [claim, contracts] = await Promise.all([
        claimPromise,
        contractsPromise,
      ]);
      const {
        actualSettlementDate: asd,
        contractualSettlementDate: csd,
        payDate: pd,
        settled,
        settler,
        settledBy,
        settledDate,
        createdDate,
        createdBy,
        creator,
        market,
        owner: account,
        counterparty: cpAcc,
        type,
        quantity,
        corporateAction: eventType,
        corporateActionID: eventID,
        eventRate,
        amount,
        currency: ccy,
        matched,
        hash: claimHash,
        transaction: txHash,
        settlementError,
      } = claim;
      const cpName = contracts.find(
        (contract) =>
          `${cpAcc}${market}` === `${contract.account}${contract.market}`,
      )?.name!;

      const status = claimStatus(pd, settled);
      return {
        claimInfo: {
          csd,
          asd,
          pd,
          market,
          account,
          cpName,
          cpAcc,
          type,
          quantity,
          eventType,
          eventID,
          eventRate,
          amount,
          ccy: ccy.substring(0, 3),
        },
        settlementInfo: {
          status,
          matched,
          claimHash,
          txHash,
          settledDate,
        },
        auditTrail: {
          audit: {
            createdDate,
            createdBy,
            creatorName: creator?.name,
            creatorId: creator?.id,
            settled: settledDate,
            settledBy,
            settledDate,
            settlerName: settler?.name,
            settlerId: settler?.id,
          },
          errors: settlementError,
        },
      };
    }),
});
