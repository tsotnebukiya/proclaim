import { getGasPrice, tokenContract, wallet } from "proclaim";
import { approve, disapprove } from "proclaim/tokenFunctions";
import { sendTransaction } from "thirdweb";
import { kv } from "@vercel/kv";

export const approveToken = async (
  currency: "USD" | "EUR",
  spender: string,
  approved: boolean,
) => {
  const latestNonce = (await kv.get<number>("latestNonce")) as number;
  const newNonce = latestNonce + 1;
  const parameter = {
    contract: tokenContract(currency),
    spender: spender as `0x${string}`,
    nonce: newNonce,
    gasPrice: await getGasPrice(),
  };
  const transaction = approved ? approve(parameter) : disapprove(parameter);
  const { transactionHash } = await sendTransaction({
    transaction: transaction,
    account: wallet,
  });
  await kv.set<number>("latestNonce", newNonce);
  return transactionHash;
};
