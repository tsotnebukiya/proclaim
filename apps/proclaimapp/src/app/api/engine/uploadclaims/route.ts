import { DummyClaimsArraySchema } from "@/lib/schemas";
import { db } from "@/server/db";
import processDummy from "@/lib/processDummy";
import { allKeys, getBankDetails, name } from "proclaim/depositoryFunctions";
import { depositoryContract } from "proclaim";
import { env } from "@/env";
import { z } from "zod";
import axios from "axios";
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
