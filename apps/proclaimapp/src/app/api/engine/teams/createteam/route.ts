import { type NextRequest, NextResponse } from "next/server";
import createTeam from "@/server/lib/teams/createTeam";
import { createTeamSchema } from "@/server/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const object: unknown = await req.json();

  try {
    const input = createTeamSchema.parse(object);
    const response = await createTeam(input);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", error: errorMessage },
      { status: 500 },
    );
  }
}
