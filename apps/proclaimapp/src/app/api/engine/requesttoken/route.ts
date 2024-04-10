import { DummyClaimsArraySchema } from "@/lib/schemas";
import { db } from "@/server/db";
import processDummy from "@/lib/processDummy";
import { allKeys, getBankDetails, name } from "proclaim/depositoryFunctions";
import { depositoryContract } from "proclaim";
import { env } from "@/env";
import { z } from "zod";
import axios from "axios";
import { NextResponse } from "next/server";

const schema = z.object({
  amount: z.number(),
  currency: z.enum(["EUR", "USD"]),
});

export async function POST(req: Request) {
  const object: unknown = await req.json();

  try {
    const receivedData = schema.parse(object);
    const res = await axios.post(`${env.HUB_API}/minttoken`, {
      ethAddress: env.ETH_ADDRESS,
      ...receivedData,
    });
    if (res.status !== 200) {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
