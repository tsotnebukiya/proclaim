import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import {
  generateDummyClaimsData,
  groupClaimsByOwner,
} from "@/lib/createClaims";
import { sendPromises } from "@/lib/distributeClaims";

export const config = {
  runtime: "edge",
};

export async function GET() {
  const lastRefRedis = (await kv.get<number>("lastRefRedis")) as number;
  const { dummyClaimsData, lastReference } =
    generateDummyClaimsData(lastRefRedis);
  const groupedClaims = groupClaimsByOwner(dummyClaimsData);
  try {
    await Promise.all(sendPromises(groupedClaims));
    console.log("All claims have been sent successfully.");
  } catch (error) {
    console.error("An error occurred while sending claims:", error);
  }
  const response = await kv.set("lastRefRedis", lastReference);
  return new NextResponse(JSON.stringify({ response, lastReference }), {
    status: 200,
  });
}
