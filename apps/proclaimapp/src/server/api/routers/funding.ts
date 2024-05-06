import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import getTokenData from "@/server/lib/tokens/getTokensData";
import requestToken from "@/server/lib/tokens/requestToken";
import { z } from "zod";

export const fundingRouter = createTRPCRouter({
  getGeneralData: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { token } = input;
      const tokenData = getTokenData({ token });
      return tokenData;
    }),
  requestTokens: publicProcedure
    .input(
      z.object({
        token: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { amount, token } = input;
      await requestToken({ amount, token });
      return { amount };
    }),
});
