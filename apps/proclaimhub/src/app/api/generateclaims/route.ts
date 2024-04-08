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
  const { dummyClaimsData, lastReference } = generateDummyClaimsData(
    lastRefRedis + 1,
  );
  const groupedClaims = groupClaimsByOwner(dummyClaimsData);
  try {
    await Promise.all(sendPromises(groupedClaims));
    console.log("All claims have been sent successfully.");
  } catch (error) {
    console.error("An error occurred while sending claims:", error);
  }
  console.log(lastRefRedis);
  console.log(dummyClaimsData.map((el) => el.tradeReference));
  console.log(lastReference);
  const response = await kv.set("lastRefRedis", lastReference);
  return NextResponse.json({ response, lastReference }, { status: 200 });
}
