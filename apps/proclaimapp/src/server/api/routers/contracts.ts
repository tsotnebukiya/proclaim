import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  Contract,
  fetchContracts,
  getCachedContracts,
} from "@/server/lib/contracts/fetch-contracts";
import { approveToken } from "@/server/lib/tokens/approveToken";
import { kv } from "@vercel/kv";
import { z } from "zod";

export const contractsRouter = createTRPCRouter({
  getContracts: publicProcedure.query(async (): Promise<Contract[]> => {
    const contracts = await getCachedContracts();
    return contracts;
  }),
  refetchContracts: publicProcedure.mutation(async () => {
    const result = await fetchContracts();
    await kv.set("contracts", JSON.stringify(result));
    return true;
  }),
  approveContractToken: publicProcedure
    .input(
      z.object({ ccy: z.string(), address: z.string(), approve: z.boolean() }),
    )
    .mutation(async ({ input }) => {
      const { address, ccy, approve } = input;
      await approveToken(ccy as "EUR" | "USD", address, approve);
      const result = await fetchContracts();
      await kv.set("contracts", JSON.stringify(result), { ex: 3600 });
      return approve;
    }),
});
