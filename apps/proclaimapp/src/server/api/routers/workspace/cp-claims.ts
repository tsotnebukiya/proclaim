import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  CachedCPClaim,
  getCPClaims,
  getCachedCPClaims,
} from "@/server/lib/claims/contractClaims";
import { TRPCError } from "@trpc/server";
import { kv } from "@vercel/kv";
import { z } from "zod";

export const cpClaimsRouter = createTRPCRouter({
  getCPClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .query(async ({ input }) => {
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
      const data = await getCachedCPClaims(
        workspace,
        thisTeam.market,
        thisTeam.account,
      );
      return data;
    }),
  refetchCPCLaims: publicProcedure
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
      const result = await getCPClaims({
        account: thisTeam.account,
        market: thisTeam.market,
      });
      await kv.set<CachedCPClaim[]>(`${workspace}-cp-claims`, result, {
        ex: 3600,
      });
      return true;
    }),
});
