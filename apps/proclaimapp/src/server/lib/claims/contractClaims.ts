import { db } from "@/server/db";
import { bankContract } from "proclaim";
import { getClaims } from "proclaim/contractFunctions";
import { convertContractAll } from "../utils";

export default async function getContractClaims() {
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
