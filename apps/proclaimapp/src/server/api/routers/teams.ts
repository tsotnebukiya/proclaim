import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { createTeamSchema } from "@/server/lib/schemas";
import createTeam from "@/server/lib/teams/createTeam";
import { convertToUSD } from "@/server/lib/utils";
import { z } from "zod";

export const teamsRouter = createTRPCRouter({
  getTeams: publicProcedure.query(async () => {
    const teamsRes = await db.team.findMany({
      include: {
        Claim: {
          select: {
            settled: true,
            amount: true,
            currency: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return teamsRes.map((el) => {
      const settled = el.Claim.filter((c) => c.settled);
      const settledLength = settled.length;
      const pendingLength = el.Claim.filter((c) => !c.settled).length;
      const { stp, name, slug, contractAddress, id } = el;
      const totalVolumeUSD = settled.reduce((total, claim) => {
        return total + convertToUSD(claim.amount, claim.currency);
      }, 0);
      return {
        slug,
        name,
        details: {
          pending: pendingLength,
          stp,
          total: settledLength,
          volume: totalVolumeUSD,
          contractAddress,
          id,
        },
      };
    });
  }),
  createTeam: publicProcedure
    .input(createTeamSchema)
    .mutation(async ({ input }) => {
      const result = await createTeam(input);
      return result;
    }),
  switchSTP: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const currentTeam = await db.team.findUnique({
        where: {
          id: input.id,
        },
        select: {
          stp: true,
        },
      });
      await db.team.update({
        where: {
          id: input.id,
        },
        data: {
          stp: !currentTeam?.stp,
        },
      });
      return !currentTeam?.stp;
    }),
});
