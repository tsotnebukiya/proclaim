import { NextResponse } from "next/server";
import { z } from "zod";
import { mint, balanceOf } from "proclaim/tokenFunctions";
import { tokenContract, wallet } from "proclaim";
import { sendAndConfirmTransaction } from "thirdweb";

const schema = z.object({
  amount: z.number(),
  ethAddress: z.string(),
  currency: z.enum(["EUR", "USD"]),
});

export async function POST(req: Request) {
  const object: unknown = await req.json();
  console.log(object);
  try {
    const { amount, currency, ethAddress } = schema.parse(object);
    await balanceOf({
      account: ethAddress,
      contract: tokenContract(currency),
    });
    const mintTransaction = mint({
      contract: tokenContract(currency),
      amount: BigInt(amount * 100),
      recipient: ethAddress,
    });
    const { transactionHash, status } = await sendAndConfirmTransaction({
      transaction: mintTransaction,
      account: wallet,
    });

    if (status === "reverted") {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Success", transactionHash },
      { status: 200 },
    );
  } catch (error) {
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    console.log(err, "CHECKHERE");
    return NextResponse.json(
      { message: "Error", errorMessage },
      { status: 500 },
    );
  }
}
