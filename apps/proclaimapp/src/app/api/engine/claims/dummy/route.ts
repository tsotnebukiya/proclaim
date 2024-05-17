import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const claimsToUpdate = await db.claim.findMany({
      where: { settled: true },
      select: {
        id: true, // Assuming each claim has a unique identifier `id`
        payDate: true,
      },
    });
    for (const claim of claimsToUpdate) {
      await db.claim.update({
        where: { id: claim.id },
        data: { settledDate: claim.payDate },
      });
    }
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
