import { DummyClaimsArraySchema } from "@/lib/schemas";
import { db } from "@/server/db";
import processDummy from "@/lib/processDummy";
import { allKeys, getBankDetails, name } from "proclaim/depositoryFunctions";
import { depositoryContract } from "proclaim";

export async function GET() {
  // const object: unknown = await req.json();
  try {
    // const res = await allKeys({
    //   arg_0: BigInt(25343),
    //   contract: depositoryContract,
    // });
    const res = await name({
      contract: depositoryContract,
    });
    const details = await getBankDetails({
      contract: depositoryContract,
      accountNumber: BigInt(25343),
      market: "EUR",
    });
    console.log(details);
    return Response.json({ message: "Success" });
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return new Response(
      JSON.stringify({ message: "Error", error: errorMessage }),
    );
  }
}
