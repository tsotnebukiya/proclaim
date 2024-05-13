import { db } from "@/server/db";
import { bankContract } from "proclaim";
import { getClaims, getUnsettledClaims } from "proclaim/contractFunctions";
import {
  convertContractAll,
  convertContractUnsettled,
  dummyDecrypt,
  stringToClaim,
} from "../utils";
import { getCachedContracts } from "../contracts/fetch-contracts";
import { env } from "@/env";
import { kv } from "@vercel/kv";
import { DummyClaim } from "../schemas";

export async function getContractClaims() {
  const teams = await db.team.findMany();
  const claimsByContract: Record<
    string,
    {
      hash: string;
      encryptedData: string;
      amount: number;
      cpAddress: string;
      currency: string;
    }[]
  > = {};
  for (const team of teams) {
    const claimsRes = (await getClaims({
      contract: bankContract(team.contractAddress),
    })) as unknown;
    const claims = convertContractAll(
      claimsRes as [string[], string[], bigint[], string[], string[], string[]],
    );
    claimsByContract[team.contractAddress] = claims;
  }
  return claimsByContract;
}

export async function getCPClaims({
  market,
  account,
}: {
  market: string;
  account: number;
}) {
  const contracts = await getCachedContracts();
  const cpContracts = contracts.filter(
    (el) => el.type === "claim" && el.deployerAddress !== env.ETH_ADDRESS,
  );
  const cpPromises = cpContracts.map((el) => {
    const contract = bankContract(el.contractAddress);
    return getUnsettledClaims({ contract });
  });
  const data = await Promise.all(cpPromises);
  const formattedClaims = data.map((el) => {
    const rawClaims = convertContractUnsettled(
      el as [string[], string[], bigint[], string[], string[]],
    );
    const decryptedClaims = rawClaims
      .map((el) => {
        const claimData = dummyDecrypt(el.encryptedData);
        const { hash } = el;
        const data = stringToClaim(claimData);
        if (!data) {
          return null;
        }
        const cp = contracts.find(
          (contract) =>
            `${data.owner}${market}` ===
            `${contract.account}${contract.market}`,
        )?.name!;
        return {
          hash,
          ...data,
          cp,
          currency: data.currency.substring(0, 3),
          paydate: data.payDate,
          decryptedString: claimData,
        };
      })
      .filter((el) => {
        if (el) {
          return el.market + el.counterparty === market + account;
        } else {
          return false;
        }
      }) as CachedCPClaim[];
    return decryptedClaims;
  });
  return formattedClaims.flatMap((el) => el);
}

export type CachedCPClaim = DummyClaim & {
  hash: string;
  cp: string;
  decryptedString: string;
};

export async function getCachedCPClaims(
  workspace: string,
  market: string,
  account: number,
  refetch?: boolean,
) {
  if (!refetch) {
    const cachedClaims = await kv.get<CachedCPClaim[]>(
      `${workspace}-cp-claims`,
    );
    if (cachedClaims) {
      return cachedClaims;
    }
  }
  const result = await getCPClaims({ account, market });
  await kv.set<CachedCPClaim[]>(`${workspace}-cp-claims`, result, { ex: 3600 });
  return result;
}
