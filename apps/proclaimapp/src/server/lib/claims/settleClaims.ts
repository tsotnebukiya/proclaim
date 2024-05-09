import { db } from "@/server/db";
import {
  GetBankDetails,
  GetContractClaims,
  bankContract,
  depositoryContract,
  wallet,
} from "proclaim";
import {
  getUnsettledClaims,
  settleClaims as settleClaimsCall,
} from "proclaim/contractFunctions";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
import {
  convertContractUnsettled,
  dummyDecrypt,
  invertDecryptedData,
  warsawTime,
} from "../utils";
import { Claim } from "@prisma/client";
import { kv } from "@vercel/kv";
import { sendTransaction } from "thirdweb";
import { env } from "@/env";

async function sortCPClaims(claims: Claim[], banks: GetBankDetails[]) {
  const bankMap = new Map(
    banks.map((bank) => [
      `${bank.accountNumber}${bank.market}`,
      bank.contractAddress,
    ]),
  );
  const counterparties = Array.from(
    new Set(claims.map((claim) => `${claim.counterparty}${claim.market}`)),
  );

  const cpUnsettledClaims = [];
  for (const cp of counterparties) {
    const contractAddress = bankMap.get(cp);
    if (!contractAddress) {
      continue;
    }
    const contract = bankContract(contractAddress);
    const unsettledClaims = (await getUnsettledClaims({
      contract,
    })) as GetContractClaims;
    const converted = convertContractUnsettled(unsettledClaims);
    const arrayWithAddress = converted.map((el) => ({
      ...el,
      contractAddress,
    }));
    cpUnsettledClaims.push(...arrayWithAddress);
  }
  return cpUnsettledClaims.filter((cl) => cl.cpAddress === env.ETH_ADDRESS);
}

async function matchCPClaims(
  cpClaims: {
    contractAddress: string;
    hash: string;
    encryptedData: string;
    amount: number;
    cpAddress: string;
    currency: string;
  }[],
  claims: Claim[],
) {
  const claimsToSettle = [];
  const decryptedClaimsMap = new Map();
  for (const claim of claims) {
    const decryptedData = dummyDecrypt(claim.encryptedClaimData);
    decryptedClaimsMap.set(decryptedData, claim);
  }
  const updates = [];
  for (const cpClaim of cpClaims) {
    const { hash, contractAddress, encryptedData } = cpClaim;
    const cpData = invertDecryptedData(dummyDecrypt(encryptedData));

    if (decryptedClaimsMap.has(cpData)) {
      const ourClaim = decryptedClaimsMap.get(cpData);
      updates.push({
        id: ourClaim.id,
        hash: hash,
      });
      claimsToSettle.push({
        identifier: hash,
        contractAddress: contractAddress,
      });
    }
  }
  await Promise.all(
    updates.map((update) =>
      db.claim.update({
        where: { id: update.id },
        data: { hash: update.hash,matched:true },
      }),
    ),
  );
  return claimsToSettle;
}

async function sendTransactions(
  claimsToSettle: {
    identifier: string;
    contractAddress: string;
  }[],
) {
  const groupedClaims = claimsToSettle.reduce<Record<string, string[]>>(
    (acc, { identifier, contractAddress }) => {
      if (!acc[contractAddress]) {
        acc[contractAddress] = [];
      }
      acc[contractAddress]!.push(identifier);
      return acc;
    },
    {},
  );
  const transactionsResults = [];
  for (const [key, identifiers] of Object.entries(groupedClaims)) {
    const contract = bankContract(key);
    let latestNonce = (await kv.get<number>("latestNonce")) as number;
    try {
      const transaction = settleClaimsCall({
        contract,
        claimIdentifiers: identifiers as `0x${string}`[],
        nonce: latestNonce + 1,
      });
      const settledTransaction = await sendTransaction({
        transaction,
        account: wallet,
      });
      latestNonce++;
      await kv.set<number>(`latestNonce`, latestNonce);
      transactionsResults.push({
        transaction: settledTransaction.transactionHash,
      });
    } catch (err) {
      console.error(`Failed to send transaction for contract ${key}`);
    }
  }
  return transactionsResults;
}

export const settleClaims = async ({ banks }: { banks: GetBankDetails[] }) => {
  const payDate = warsawTime.startOf("d").toDate();
  const claims = await db.claim.findMany({
    where: {
      settled: false,
      type: "Payable",
      payDate: {
        lte: payDate,
      },
      team: {
        stp: true,
      },
    },
    include: {
      team: true,
    },
  });
  if (claims.length === 0) return null;
  const cpClaims = await sortCPClaims(claims, banks);
  if (cpClaims.length === 0) return null;
  const claimsToSettle = await matchCPClaims(cpClaims, claims);
  if (claimsToSettle.length === 0) return null;
  const transactionsResults = await sendTransactions(claimsToSettle);

  return transactionsResults;
};
