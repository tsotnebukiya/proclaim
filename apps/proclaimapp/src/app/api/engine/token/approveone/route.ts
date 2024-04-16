import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { tokenContract } from "proclaim";
import { isApproved } from "proclaim/tokenFunctions";
import { z } from "zod";
import { approveToken } from "@/server/lib/tokens/approveToken";

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
  spender: spenderSchema,
  approved: z.boolean(),
});

export async function POST(req: NextRequest) {
  const object: unknown = await req.json();

  try {
    const { approved, currency, spender } = schema.parse(object);
    const transactionHash = await approveToken(currency, spender, approved);
    return NextResponse.json({ transactionHash }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
