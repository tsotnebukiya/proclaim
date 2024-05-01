import { env } from "@/env";
import {
  BLOCKSCOUT_API,
  PROCLAIM_ADDRESS,
  deployers,
} from "@/server/lib/utils";
import { GetBankDetails, bankContract, depositoryContract } from "proclaim";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import axios from "axios";
import { ScoutAddress } from "@/server/lib/types";
import { name } from "proclaim/contractFunctions";

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

export default async function fetchContracts() {
  const depository: Contract = {
    name: "Banks Depository",
    contractAddress: env.PROCHAIN_DEPOSITORY_CONTRACT,
    type: "depo",
    deployerAddress: PROCLAIM_ADDRESS,
    deployer: "Proclaim",
  };
  const banksRes = (await getAllBankDetails({
    contract: depositoryContract,
  })) as unknown;
  const banks = banksRes as GetBankDetails[];
  const tokenAddresses = [env.USD_CONTRACT, env.EUR_CONTRACT];
  const namesPromises = Promise.all(
    banks.map(async (el): Promise<Contract> => {
      const returnedName = await name({
        contract: bankContract(el.contractAddress),
      });
      return {
        name: returnedName,
        contractAddress: el.contractAddress,
        deployerAddress: el.ethAddress,
        account: Number(el.accountNumber),
        market: el.market,
        deployer: deployers[el.ethAddress] || "",
        type: "claim",
      };
    }),
  );
  const tokenPromises = Promise.all(
    tokenAddresses.map(async (el): Promise<Contract> => {
      const { data } = await axios.get<ScoutAddress>(
        `${BLOCKSCOUT_API}/addresses/${el}`,
      );
      return {
        name: data.token.name,
        totalSupply: data.token.total_supply,
        holders: data.token.holders,
        contractAddress: data.hash,
        deployer: "Proclaim",
        deployerAddress: PROCLAIM_ADDRESS,
        type: "token",
      };
    }),
  );
  const [tokenResponses, namesResponses] = await Promise.all([
    tokenPromises,
    namesPromises,
  ]);
  const result = [depository, ...tokenResponses, ...namesResponses];
  return result;
}
