import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import {
  GetBankDetails,
  depositoryContract,
  tokenContract,
  wallet,
} from "proclaim";
import { isApproved, approve, disapprove } from "proclaim/tokenFunctions";
import { sendAndConfirmTransaction } from "thirdweb";
import { z } from "zod";
import { kv } from "@vercel/kv";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import { approveToken } from "@/server/lib/tokens/approveToken";
import { delay } from "@/server/lib/utils";

const currencySchema = z.enum(["USD", "EUR"]);
const spenderSchema = z.string();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const currency = url.searchParams.get("currency");
    const spender = url.searchParams.get("spender");
    const parsedspender = spenderSchema.parse(spender);
    const parsedCurrency = currencySchema.parse(currency);
    const response = await isApproved({
      contract: tokenContract(parsedCurrency),
      owner: env.ETH_ADDRESS,
      spender: parsedspender,
    });
    return NextResponse.json(
      { message: "Success", approved: response },
      { status: 200 },
    );
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}

const schema = z.object({
  currency: currencySchema,
  approved: z.boolean(),
});

export async function POST(req: NextRequest) {
  const object: unknown = await req.json();

  try {
    const { approved, currency } = schema.parse(object);
    const banks = (await getAllBankDetails({
      contract: depositoryContract,
    })) as GetBankDetails[];
    const addresses = banks.map((el) => el.contractAddress);
    const transactions: string[] = [];
    for (const address of addresses) {
      const transactionHash = await approveToken(currency, address, approved);
      transactions.push(transactionHash);
    }
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
