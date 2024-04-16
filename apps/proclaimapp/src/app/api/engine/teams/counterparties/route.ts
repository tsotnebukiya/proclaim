import { NextResponse } from "next/server";
import { processOwnEvents } from "@/server/lib/claims/processEvents";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import { GetBankDetails, depositoryContract } from "proclaim";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const banks = (await getAllBankDetails({
      contract: depositoryContract,
    })) as GetBankDetails[];
    console.log(banks);
    const formatted = banks.map((el) => ({
      ...el,
      accountNumber: Number(el.accountNumber),
    }));
    return NextResponse.json(
      { message: "Success", formatted },
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
