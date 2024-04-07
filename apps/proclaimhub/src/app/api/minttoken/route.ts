import { NextResponse } from "next/server";
import { z } from "zod";
import { getBankDetails } from "proclaim/depositoryFunctions";
import { mint } from "proclaim/tokenFunctions";
import {
  GetBankDetails,
  depositoryContract,
  tokenContract,
  wallet,
} from "proclaim";
import { sendAndConfirmTransaction } from "thirdweb";

export const runtime = "edge";

const schema = z.object({
  account: z.number(),
  amount: z.number(),
  market: z.string(),
  currency: z.enum(["EUR", "USD"]),
});
export async function POST(req: Request) {
  const object: unknown = await req.json();
  try {
    const { account, amount, market, currency } = schema.parse(object);
    const res = (await getBankDetails({
      contract: depositoryContract,
      accountNumber: BigInt(account),
      market: market,
    })) as unknown;
    const result = res as GetBankDetails;
    const mintTransaction = mint({
      contract: tokenContract(currency),
      amount: BigInt(amount * 100),
      recipient: result.ethAddress,
    });
    const { transactionHash, status } = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: wallet,
    });
    if (status === "reverted") {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Success", transactionHash },
      { status: 200 },
    );
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", errorMessage },
      { status: 500 },
    );
  }
}
