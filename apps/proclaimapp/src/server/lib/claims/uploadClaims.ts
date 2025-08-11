import {
  GetBankDetails,
  bankContract,
  depositoryContract,
  getGasPrice,
  getLatestNonce,
  wallet,
} from "proclaim";
import { addClaims } from "proclaim/contractFunctions";
import { type Claim } from "@prisma/client";
import { sendTransaction } from "thirdweb";
import { kv } from "@vercel/kv";
import { db } from "@/server/db";
import moment from "moment-timezone";

export const uploadClaims = async ({
  banks,
  teamId,
  manual,
}: {
  banks: GetBankDetails[];
  teamId?: number;
  manual?: boolean;
}) => {
  const warsawTime = moment.utc();
  const gasPrice = await getGasPrice();
  const payDate = warsawTime.startOf("d").toDate();
  console.log("🔍 Starting database query for claims with filters:", {
    teamId,
    manual,
    payDate,
  });
  const claims = await db.claim.findMany({
    where: {
      settled: false,
      uploaded: false,
      type: "Receivable",
      payDate: {
        lte: payDate,
      },
      teamId,
      ...(manual ? {} : { team: { stp: true } }),
    },
    include: {
      team: true,
    },
  });
  console.log("✅ Claims query completed. Found claims:", claims.length);
  if (claims.length === 0) {
    return null;
  }
  const groupedClaims = claims.reduce<Record<string, Claim[]>>((acc, claim) => {
    const key = `${claim.counterparty}${claim.market}`;
    if (banks.some((b) => `${b.accountNumber}${b.market}` === key)) {
      (acc[claim.owner] = acc[claim.owner] || []).push(claim);
    }
    return acc;
  }, {});
  const transactionsResults = [];
  for (const [owner, claims] of Object.entries(groupedClaims)) {
    if (claims.length === 0) {
      return null;
    }
    const transactionData = claims.map((claim) => {
      const key = `${claim.counterparty}${claim.market}`;
      return {
        amountOwed: BigInt(claim.amount * 100),
        claimIdentifier: claim.hash as `0x${string}`,
        encryptedClaimData: claim.encryptedClaimData,
        counterpartyAddress: banks.find(
          (e) => `${e.accountNumber}${e.market}` === key,
        )?.ethAddress!,
        tokenName: claim.currency,
      };
    });
    const contractAddress = banks.find(
      (el) => el.accountNumber === BigInt(owner),
    )?.contractAddress!;
    const contract = bankContract(contractAddress);
    console.log("🔢 Getting latest nonce for owner:", owner);
    const latestNonce = await getLatestNonce();
    console.log("✅ Latest nonce retrieved:", latestNonce);
    const transaction = addClaims({
      amountsOwed: transactionData.map((data) => data.amountOwed),
      claimIdentifiers: transactionData.map((data) => data.claimIdentifier),
      contract: contract,
      counterpartyAddresses: transactionData.map(
        (data) => data.counterpartyAddress as `0x${string}`,
      ),
      encryptedClaimDatas: transactionData.map(
        (data) => data.encryptedClaimData,
      ),
      tokenNames: transactionData.map((data) => data.tokenName),
      nonce: latestNonce,
      gasPrice,
    });
    console.log(
      "📤 Sending transaction to blockchain for owner:",
      owner,
      "with",
      claims.length,
      "claims",
    );
    const settledTransaction = await sendTransaction({
      transaction: transaction,
      account: wallet,
    });
    console.log(
      "✅ Transaction sent successfully. Hash:",
      settledTransaction.transactionHash,
    );
    transactionsResults.push({
      transaction: settledTransaction.transactionHash,
    });
  }
  console.log(
    "📝 Creating global event for UPLOAD with",
    claims.length,
    "claims",
  );
  await db.globalEvents.create({
    data: {
      type: "UPLOAD",
      claimsCount: claims.length,
      teamId,
    },
  });
  console.log("✅ Global event created successfully");
  return { transactionsResults, count: claims.length };
};
