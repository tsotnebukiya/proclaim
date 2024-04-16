import { tokenContract, wallet } from "proclaim";
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
    spender,
    nonce: newNonce,
  };
  const transaction = approved ? approve(parameter) : disapprove(parameter);
  const { transactionHash } = await sendTransaction({
    transaction: transaction,
    account: wallet,
  });
  console.log(transactionHash);
  await kv.set<number>("latestNonce", newNonce);
  return transactionHash;
};
