import getContractClaims from "@/server/lib/claims/contractClaims";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getContractClaims();
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
