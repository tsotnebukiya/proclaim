import { NextResponse } from "next/server";
import { processOwnEvents } from "@/server/lib/claims/processEvents";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const res = await processOwnEvents();
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
