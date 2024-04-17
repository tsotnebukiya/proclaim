import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { GetBankDetails, depositoryContract, tokenContract } from "proclaim";
import { balanceOf } from "proclaim/tokenFunctions";
import { z } from "zod";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import { approveToken } from "@/server/lib/tokens/approveToken";

const currencySchema = z.enum(["USD", "EUR"]);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const currency = url.searchParams.get("currency");
    const parsedCurrency = currencySchema.parse(currency);
    const response = (await balanceOf({
      contract: tokenContract(parsedCurrency),
      account: env.ETH_ADDRESS,
    })) as unknown;
    const amount = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(response) / 100);
    return NextResponse.json({ message: "Success", amount }, { status: 200 });
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
    const banksRes = (await getAllBankDetails({
      contract: depositoryContract,
    })) as unknown;
    const banks = banksRes as GetBankDetails[]
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
