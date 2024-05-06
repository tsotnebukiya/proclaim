import { env } from "@/env";
import { db } from "@/server/db";
import axios from "axios";

export default async function requestToken({
  token,
  amount,
}: {
  token: string;
  amount: number;
}) {
  const res = await axios.post<{ transactionHash: string }>(
    `${env.HUB_API}/minttoken`,
    {
      ethAddress: env.ETH_ADDRESS,
      amount,
      currency: token.toUpperCase(),
    },
  );
  const transaction = res.data.transactionHash;
  await db.tokenRequest.create({
    data: {
      amount,
      token: token.toLocaleLowerCase(),
      transaction,
    },
  });
  return { amount };
}
