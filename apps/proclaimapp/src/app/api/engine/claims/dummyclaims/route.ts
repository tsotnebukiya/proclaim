import { DummyClaimsArraySchema } from "@/server/lib/schemas";
import { db } from "@/server/db";
import processDummy from "@/server/lib/claims/processDummy";
import { Claim } from "@prisma/client";

export async function POST(req: Request) {
  const object: unknown = await req.json();
  try {
    const validatedData = DummyClaimsArraySchema.parse(object);
    const processedData = await processDummy(validatedData);
    await db.claim.createMany({
      data: processedData,
    });
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occured.";
    return new Response(
      JSON.stringify({ message: "Validation Failed", error: errorMessage }),
    );
  }
}

export async function GET() {
  return Response.json({ message: "Success" });
}
