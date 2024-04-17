import { processEvents } from "@/server/lib/claims/processEvents";
import { settleClaims } from "@/server/lib/claims/settleClaims";
import { NextResponse } from "next/server";
import { GetBankDetails, depositoryContract } from "proclaim";
import { getAllBankDetails } from "proclaim/depositoryFunctions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banksRes = (await getAllBankDetails({
      contract: depositoryContract,
    })) as unknown;
    const banks = banksRes as GetBankDetails[];
    const result = await settleClaims({ banks });
    await processEvents({ banks });
    return NextResponse.json({ message: "Success", result }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
