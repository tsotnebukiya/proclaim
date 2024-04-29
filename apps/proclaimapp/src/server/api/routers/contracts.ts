import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

export const contractsRouter = createTRPCRouter({
  getContracts: publicProcedure.query(async () => {
    let contracts = cache.get<number[]>("contracts");
    if (contracts) {
      return contracts;
    }
    contracts = [
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
    ];
    cache.set("contracts", contracts);
    return contracts;
  }),
});
