import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import {
  generateDummyClaimsData,
  groupClaimsByOwner,
} from "@/lib/createClaims";
import { sendPromises } from "@/lib/distributeClaims";
import { accounts } from "@/lib/owners";

export async function GET() {
  const lastRefRedis = (await kv.get<number>("lastRefRedis"))!;
  const icsdAccounts = accounts.map((el) => el.icsd);
  const usAccounts = accounts.map((el) => el.us);
  const { dummyClaimsData: icsdClaims, lastReference: preLastReference } =
    generateDummyClaimsData(lastRefRedis + 1, "ICSD", icsdAccounts);
  const { dummyClaimsData: usClaims, lastReference } = generateDummyClaimsData(
    preLastReference + 1,
    "US",
    usAccounts,
  );
  const groupedClaims = groupClaimsByOwner([...icsdClaims, ...usClaims]);
  try {
    await Promise.all(sendPromises(groupedClaims));
    console.log("All claims have been sent successfully.");
  } catch (error) {
    console.error("An error occurred while sending claims:", error);
  }
  const response = (await kv.set("lastRefRedis", lastReference)) as number;
  return NextResponse.json(
    { response, lastReference, groupedClaims },
    { status: 200 },
  );
}
