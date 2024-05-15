import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  CachedCPClaim,
  getCPClaims,
  getCachedCPClaims,
} from "@/server/lib/claims/contractClaims";
import { convertToUSD, warsawTime } from "@/server/lib/utils";
import { Claim } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { kv } from "@vercel/kv";
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
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
        include: {
          GlobalEvents: true,
          Claim: {
            where: {
              payDate: {
                gte: warsawTime.startOf("d").toDate(),
              },
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

      const { GlobalEvents, Claim } = thisTeam;

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
        const payDateMs = claim.payDate.getTime();
        const amount =
          claim.currency === "USDt"
            ? claim.amount
            : convertToUSD(claim.amount, "EURt");

        // const isToday =
        const isTomorrow = payDateMs == tomorrowMs;
        const isWholeWeek =
          payDateMs >= tomorrowMs && payDateMs <= sixDaysLaterMs;

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
});
