import { env } from "@/env";
import { db } from "@/server/db";
import { deployContract, depositoryContract, wallet } from "proclaim";
import { name } from "proclaim/depositoryFunctions";
import { sendAndConfirmTransaction } from "thirdweb";
import { kv } from "@vercel/kv";

import { slugify } from "@/server/lib/utils";
import { CreateTeamType } from "../schemas";

export default async function createTeam(object: CreateTeamType) {
  try {
    await name({ contract: depositoryContract });
    const { account, market, teamName, stp } = object;
    const transaction = deployContract({
      account: Number(account),
      market,
      publicKey: env.PROCHAIN_PUBLIC_KEY,
      teamName,
    });
    const { contractAddress } = await sendAndConfirmTransaction({
      transaction: transaction,
      account: wallet,
    });
    const latestNonce = (await kv.get<number>("latestNonce"))!;
    await kv.set<number>("latestNonce", latestNonce + 1);
    const response = await db.team.create({
      data: {
        account: Number(account),
        market,
        contractAddress: contractAddress!,
        name: teamName,
        slug: slugify(teamName),
        stp,
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
}
