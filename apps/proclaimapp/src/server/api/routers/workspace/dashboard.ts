import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  CachedCPClaim,
  getCPClaims,
  getCachedCPClaims,
} from "@/server/lib/claims/contractClaims";
import { groupUpcoming } from "@/server/lib/claims/getDashboardStats";
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
      const thisTeam = await db.team.findFirst({
        where: {
          slug: workspace,
        },
        include: {
          GlobalEvents: true,
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
      const returnObject = {
        events: GlobalEvents,
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
