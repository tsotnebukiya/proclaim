import { env } from "@/env";
import {
  BLOCKSCOUT_API,
  PROCLAIM_ADDRESS,
  deployers,
} from "@/server/lib/utils";
import {
  GetBankDetails,
  bankContract,
  depositoryContract,
  tokenContract,
} from "proclaim";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import axios from "axios";
import { ScoutAddress } from "@/server/lib/types";
import { name } from "proclaim/contractFunctions";
import { kv } from "@vercel/kv";
import { isApproved } from "proclaim/tokenFunctions";

export type Contract = {
  name: string;
  totalSupply?: string;
  holders?: string;
  contractAddress: string;
  deployer: string;
  deployerAddress: string;
  type: "depo" | "token" | "claim";
  account?: number;
  market?: string;
  ccyApproved?: { ccy: string; approved: boolean }[];
  cp?: boolean;
};

export async function fetchContracts() {
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
  const tokenApprovalPromises = namesResponses
    .filter((contract) => contract.deployerAddress !== env.ETH_ADDRESS)
    .map(async (contract) => {
      const usdPromise = isApproved({
        contract: tokenContract("USD"),
        owner: env.ETH_ADDRESS,
        spender: contract.contractAddress,
      });
      const eurPromise = isApproved({
        contract: tokenContract("EUR"),
        owner: env.ETH_ADDRESS,
        spender: contract.contractAddress,
      });
      return Promise.all([usdPromise, eurPromise]).then(
        ([usdApproved, eurApproved]) => ({
          contractAddress: contract.contractAddress,
          ccyApproved: [
            { ccy: "USD", approved: usdApproved },
            { ccy: "EUR", approved: eurApproved },
          ],
        }),
      );
    });
  const tokenApprovalResponses = await Promise.all(tokenApprovalPromises);
  namesResponses.forEach((el) => {
    const tokenResponse = tokenApprovalResponses.find(
      (tokenApp) => tokenApp.contractAddress === el.contractAddress,
    );
    if (tokenResponse) {
      el.ccyApproved = tokenResponse.ccyApproved;
      el.cp = true;
    }
  });
  const result = [depository, ...tokenResponses, ...namesResponses];
  return result;
}

export async function getCachedContracts() {
  const cachedContracts = await kv.get<Contract[]>("contracts");
  if (cachedContracts) {
    return cachedContracts;
  }
  const result = await fetchContracts();
  await kv.set("contracts", result, { ex: 3600 });
  return result;
}
