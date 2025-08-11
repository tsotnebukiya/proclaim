import { NextResponse } from "next/server";
import { z } from "zod";
import { mint, balanceOf } from "proclaim/tokenFunctions";
import { getGasPrice, tokenContract, wallet } from "proclaim";
import { sendAndConfirmTransaction } from "thirdweb";

const schema = z.object({
  amount: z.number(),
  ethAddress: z.string(),
  currency: z.enum(["EUR", "USD"]),
});

export async function POST(req: Request) {
  const object: unknown = await req.json();
  try {
    const { amount, currency, ethAddress } = schema.parse(object);
    await balanceOf({
      account: ethAddress as `0x${string}`,
      contract: tokenContract(currency),
    });
    const mintTransaction = mint({
      contract: tokenContract(currency),
      amount: BigInt(amount * 100),
      gasPrice: await getGasPrice(),
      recipient: ethAddress as `0x${string}`,
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
    console.log(error, "error");
    const err = error as { message?: string };
    const errorMessage = err.message ? err.message : "An error occured.";
    return NextResponse.json(
      { message: "Error", errorMessage },
      { status: 500 },
    );
  }
}
