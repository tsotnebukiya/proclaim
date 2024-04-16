import { NextResponse } from "next/server";
import { uploadClaims } from "@/server/lib/claims/uploadClaims";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const result = await uploadClaims();
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
