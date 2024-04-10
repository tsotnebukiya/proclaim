import { NextResponse } from "next/server";
import { uploadClaims } from "@/lib/uploadClaims";

export async function GET(req: Request) {
  try {
    const hey = await uploadClaims();
    return NextResponse.json({ message: "SUccess" }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
