import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  BLOCKSCOUT_API,
  PROCLAIM_ADDRESS,
  deployers,
} from "@/server/lib/utils";
import NodeCache from "node-cache";
import { GetBankDetails, bankContract, depositoryContract } from "proclaim";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import axios from "axios";
import { ScoutAddress } from "@/server/lib/types";
import { totalSupply } from "proclaim/tokenFunctions";
import { name } from "proclaim/contractFunctions";
import { z } from "zod";
import fetchContracts from "@/server/lib/contracts/fetch-contracts";

const cache = new NodeCache({ stdTTL: 3600 });

type Contract = {
  name: string;
  totalSupply?: string;
  holders?: string;
  contractAddress: string;
  deployer: string;
  deployerAddress: string;
  type: "depo" | "token" | "claim";
  account?: number;
  market?: string;
};

export const contractsRouter = createTRPCRouter({
  getContracts: publicProcedure.query(async (): Promise<Contract[]> => {
    let contracts = cache.get<Contract[]>("contracts");
    if (contracts) {
      return contracts;
    }
    const result = await fetchContracts();
    cache.set("contracts", result);
    return result;
  }),
  refetchContracts: publicProcedure.mutation(async () => {
    const result = await fetchContracts();
    cache.set("contracts", result);
    return true;
  }),
});
