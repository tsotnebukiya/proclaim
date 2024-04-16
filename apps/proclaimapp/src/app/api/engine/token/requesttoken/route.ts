import { env } from "@/env";
import { z } from "zod";
import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
