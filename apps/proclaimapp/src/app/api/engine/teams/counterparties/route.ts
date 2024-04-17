import { NextResponse } from "next/server";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import { type GetBankDetails, depositoryContract } from "proclaim";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banksRes = (await getAllBankDetails({
      contract: depositoryContract,
    })) as unknown;
    const banks = banksRes as GetBankDetails[];
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
