import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  CachedCPClaim,
  getCPClaims,
  getCachedCPClaims,
} from "@/server/lib/claims/contractClaims";
import { processEvents } from "@/server/lib/claims/processEvents";
import { settleClaims } from "@/server/lib/claims/settleClaims";
import { uploadClaims } from "@/server/lib/claims/uploadClaims";
import { getCachedContracts } from "@/server/lib/contracts/fetch-contracts";
import { claimStatus, convertToUSD } from "@/server/lib/utils";
import { Claim } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { kv } from "@vercel/kv";
import moment from "moment-timezone";
import { GetBankDetails, depositoryContract } from "proclaim";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import { z } from "zod";

type GroupStats = {
  totalAmount: number;
  share: number;
};

type Group = {
  [key: string]: GroupStats;
};

export const dashboardRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .query(async ({ input }) => {
      const { workspace } = input;
      const warsawTime = moment.utc();
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
        include: {
          GlobalEvents: true,
          Claim: {
            where: {
              settled: false,
            },
          },
        },
      });

      if (!thisTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such team found",
        });
      }
      const GlobalEvents = await db.globalEvents.findMany({
        where: {
          OR: [{ teamId: thisTeam.id }, { teamId: null }],
        },
        orderBy: {
          triggeredAt: "desc",
        },
      });
      const { Claim } = thisTeam;
      const tomorrow = warsawTime.add(1, "day").startOf("day").toDate();
      const sixDaysLater = warsawTime.add(6, "day").endOf("day").toDate();
      const tomorrowMs = tomorrow.getTime();
      const sixDaysLaterMs = sixDaysLater.getTime();
      const claimsByCounterparty: {
        tomorrow: Group;
        wholeWeek: Group;
      } = {
        tomorrow: {},
        wholeWeek: {},
      };

      const claimsByCorporateAction: {
        tomorrow: Group;
        wholeWeek: Group;
      } = {
        tomorrow: {},
        wholeWeek: {},
      };

      const addToGroup = (group: Group, key: string, amount: number) => {
        if (!group[key]) {
          group[key] = { totalAmount: 0, share: 0 };
        }
        group[key]!.totalAmount += amount;
      };

      let totalAmountTomorrow = 0;
      let totalAmountWholeWeek = 0;

      Claim.forEach((claim) => {
        const payDateMs = moment(claim.payDate)
          .utc()
          .startOf("day")
          .toDate()
          .getTime();
        const amount =
          claim.currency === "USDt"
            ? claim.amount
            : convertToUSD(claim.amount, "EURt");

        const isTomorrow = payDateMs == tomorrowMs;
        const isWholeWeek =
          payDateMs >= tomorrowMs && payDateMs <= sixDaysLaterMs;
        console.log(
          "CHECKTHIS",
          claim.payDate,
          payDateMs,
          claim.tradeReference,
        );
        if (isTomorrow) {
          addToGroup(claimsByCounterparty.tomorrow, claim.counterparty, amount);
          addToGroup(
            claimsByCorporateAction.tomorrow,
            claim.corporateAction,
            amount,
          );
          totalAmountTomorrow += amount;
        }

        if (isWholeWeek) {
          addToGroup(
            claimsByCounterparty.wholeWeek,
            claim.counterparty,
            amount,
          );
          addToGroup(
            claimsByCorporateAction.wholeWeek,
            claim.corporateAction,
            amount,
          );
          totalAmountWholeWeek += amount;
        }
      });
      const calculateShares = (group: Group, totalAmount: number) => {
        for (const key in group) {
          group[key]!.share = group[key]!.totalAmount / totalAmount;
        }
      };

      calculateShares(claimsByCounterparty.tomorrow, totalAmountTomorrow);
      calculateShares(claimsByCounterparty.wholeWeek, totalAmountWholeWeek);
      calculateShares(claimsByCorporateAction.tomorrow, totalAmountTomorrow);
      calculateShares(claimsByCorporateAction.wholeWeek, totalAmountWholeWeek);

      const returnObject = {
        events: GlobalEvents,
        claims: {
          byCounterparty: claimsByCounterparty,
          byCorporateAction: claimsByCorporateAction,
        },
      };

      return returnObject;
    }),
  settleClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .mutation(async ({ input }) => {
      const { workspace } = input;
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
      });

      if (!thisTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such team found",
        });
      }
      const banksRes = (await getAllBankDetails({
        contract: depositoryContract,
      })) as unknown;
      const banks = banksRes as GetBankDetails[];
      await settleClaims({ banks, manual: true, teamId: thisTeam.id });
      return true;
    }),
  uploadClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .mutation(async ({ input }) => {
      const { workspace } = input;
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
      });
      if (!thisTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such team found",
        });
      }
      const banksRes = (await getAllBankDetails({
        contract: depositoryContract,
      })) as unknown;
      const banks = banksRes as GetBankDetails[];
      await uploadClaims({ banks, manual: true, teamId: thisTeam.id });
      return true;
    }),
  updateClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .mutation(async ({ input }) => {
      const { workspace } = input;
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
      });

      if (!thisTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such team found",
        });
      }
      const banksRes = (await getAllBankDetails({
        contract: depositoryContract,
      })) as unknown;
      const banks = banksRes as GetBankDetails[];
      await processEvents({ banks, teamId: thisTeam.id });
      return true;
    }),
});
