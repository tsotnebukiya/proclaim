import {
  getGasPrice,
  tokenContract,
  wallet,
  proChain,
  getLatestNonce,
} from "proclaim";
import { approve, disapprove } from "proclaim/tokenFunctions";
import { sendTransaction, waitForReceipt } from "thirdweb";

export const approveToken = async (
  currency: "USD" | "EUR",
  spender: string,
  approved: boolean,
) => {
  const latestNonce = await getLatestNonce();
  const price = await getGasPrice();
  const finalPrice = BigInt(Number(price) * 1.1);
  const parameter = {
    contract: tokenContract(currency),
    spender: spender as `0x${string}`,
    nonce: latestNonce,
    gasPrice: finalPrice,
  };

  console.log(`🔍 ApproveToken Debug Info:
    - Currency: ${currency}
    - Spender: ${spender}
    - Approved: ${approved}
    - Chain ID: ${proChain.id}
    - Chain RPC: ${proChain.rpc}
    - Nonce: ${latestNonce}
    - Gas Price: ${parameter.gasPrice.toString()}
    - Contract Address: ${tokenContract(currency).address}
    - Wallet Address: ${wallet.address}`);

  const transaction = approved ? approve(parameter) : disapprove(parameter);

  try {
    const result = await sendTransaction({
      transaction: transaction,
      account: wallet,
    });

    console.log(`✅ Transaction submitted: ${result.transactionHash}`);
    console.log(
      `🔗 Explorer URL: Check your explorer for chain ${proChain.id}`,
    );

    // Wait for transaction receipt to confirm it was mined
    try {
      const receipt = await waitForReceipt({
        client: tokenContract(currency).client,
        chain: proChain,
        transactionHash: result.transactionHash,
        maxBlocksWaitTime: 300,
      });

      console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
      console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
      console.log(
        `📝 Transaction status: ${receipt.status === "success" ? "SUCCESS" : "FAILED"}`,
      );

      if (receipt.status !== "success") {
        console.error(`❌ Transaction failed but was mined`);
      }
    } catch (receiptError) {
      console.error(`❌ Error waiting for receipt: ${receiptError}`);
      console.log(
        `⚠️  Transaction may still be pending: ${result.transactionHash}`,
      );
    }

    return result.transactionHash;
  } catch (error) {
    console.error(`❌ Transaction failed to submit:`, error);
    // Don't increment nonce if transaction failed to submit
    throw error;
  }
};
