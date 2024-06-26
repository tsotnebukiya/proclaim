import {
  GetBankDetails,
  bankContract,
  depositoryContract,
  wallet,
} from "proclaim";
import { addClaims } from "proclaim/contractFunctions";
import { type Claim } from "@prisma/client";
import { sendTransaction } from "thirdweb";
import { kv } from "@vercel/kv";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
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
  const payDate = warsawTime.startOf("d").toDate();
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
    const latestNonce = (await kv.get<number>("latestNonce")) as number;
    const newNonce = latestNonce + 1;
    const transaction = addClaims({
      amountsOwed: transactionData.map((data) => data.amountOwed),
      claimIdentifiers: transactionData.map((data) => data.claimIdentifier),
      contract: contract,
      counterpartyAddresses: transactionData.map(
        (data) => data.counterpartyAddress,
      ),
      encryptedClaimDatas: transactionData.map(
        (data) => data.encryptedClaimData,
      ),
      tokenNames: transactionData.map((data) => data.tokenName),
      nonce: newNonce,
    });
    const settledTransaction = await sendTransaction({
      transaction: transaction,
      account: wallet,
    });
    await kv.set<number>("latestNonce", newNonce);
    transactionsResults.push({
      transaction: settledTransaction.transactionHash,
    });
  }
  await db.globalEvents.create({
    data: {
      type: "UPLOAD",
      claimsCount: claims.length,
      teamId,
    },
  });
  return { transactionsResults, count: claims.length };
};
