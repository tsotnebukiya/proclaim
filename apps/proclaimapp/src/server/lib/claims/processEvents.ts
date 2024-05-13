import { db } from "@/server/db";
import { GetBankDetails, bankContract, depositoryContract } from "proclaim";
import { kv } from "@vercel/kv";

import { getContractEvents } from "thirdweb";
import { env } from "@/env";
import { Claim } from "@prisma/client";

type Error = {
  claimIdentifier: `0x${string}`;
  counterpartyAddress: string;
  reason: string;
};

async function processUploadedEvents(hashes: string[]) {
  await db.claim.updateMany({
    where: { hash: { in: hashes }, settled: false },
    data: {
      uploaded: true,
    },
  });
}

async function processSettledEvents(
  events: { hash: string; transactionHash: string; transactionLog: number }[],
) {
  const updatePromises = events.map(async (event) => {
    return await db.claim.updateMany({
      where: { hash: event.hash, settled: false },
      data: {
        settled: true,
        matched: true,
        settledBy: "SYSTEM",
        transaction: event.transactionHash,
        transactionLog: event.transactionLog,
        settledDate: new Date(),
      },
    });
  });

  await Promise.all(updatePromises);
}

async function processSettlementErrors(cpEvents: any, claims: Claim[]) {
  const errors = cpEvents
    .filter((ev: any) => ev.eventName === "SettlementError")
    .map((ev: any) => {
      const { address: contractAddress, eventName, transactionHash } = ev;
      const { claimIdentifier, reason } = ev.args as Error;
      const claimId = claims.find(
        (claim) => claim.hash === claimIdentifier,
      )?.id;
      return claimId
        ? { claimId, contractAddress, reason, eventName, transactionHash }
        : null;
    })
    .filter((e: any) => e);
  await db.blockchainError.createMany({ data: errors.filter((e: any) => e) });
}

export const processEvents = async ({ banks }: { banks: GetBankDetails[] }) => {
  try {
    const teams = await db.team.findMany();

    const claims = await db.claim.findMany({
      where: {
        settled: false,
      },
    });
    const contracts = banks.map((el) => el.contractAddress);
    const lastCheckedBlock = (await kv.get<number>(
      "lastCheckedBlock",
    )) as number;
    const allEventsRes = await Promise.all(
      contracts.map(async (contractAddress) => {
        return getContractEvents({
          contract: bankContract(contractAddress),
          fromBlock: BigInt(lastCheckedBlock + 1),
          toBlock: "latest",
        });
      }),
    );
    const allEvents = allEventsRes.flatMap((event) => event);
    const ourEvents = allEvents.filter((ev) =>
      teams.some((team) => team.contractAddress === ev.address),
    );
    const cpEvents = allEvents.filter(
      (ev) =>
        teams.every((team) => team.contractAddress !== ev.address) &&
        ev.args.counterpartyAddress === env.ETH_ADDRESS,
    );
    const latestBlock = allEvents.reduce(
      (max, event) => (event.blockNumber > max ? event.blockNumber : max),
      BigInt(0),
    );
    await kv.set<number>("lastCheckedBlock", Number(latestBlock));
    if (!allEvents || allEvents.length === 0) {
      return null;
    }
    const updatePromises = [
      processUploadedEvents(
        ourEvents
          .filter((ev) => ev.eventName === "ClaimAdded")
          .map((el) => el.args.claimIdentifier),
      ),
      processSettlementErrors(cpEvents, claims),
    ];
    await Promise.all(updatePromises);
    await processSettledEvents(
      [...cpEvents, ...ourEvents]
        .filter((ev) => ev.eventName === "ClaimSettled")
        .map((el) => ({
          hash: el.args.claimIdentifier,
          transactionHash: el.transactionHash,
          transactionLog: el.logIndex,
        })),
    );
    return true;
  } catch (err) {
    return false;
  }
};

export const processSpecifiContractEvents = async ({
  claimHash,
  claimId,
  contractAddress,
  tradeRef,
  userId,
  type,
}: {
  contractAddress: string;
  tradeRef: string;
  claimId: number;
  claimHash: string;
  userId: string;
  type: "upload" | "settle";
}) => {
  try {
    const events = await getContractEvents({
      contract: bankContract(contractAddress),
      fromBlock: BigInt(1 + 1),
      toBlock: "latest",
    });

    const allEvents = events
      .flatMap((event) => event)
      .filter((ev: any) => ev.args.claimIdentifier === claimHash);
    if (!allEvents || !allEvents[0]) {
      return type === "settle"
        ? "Settlement in Progress"
        : "Uploading in Progress";
    }
    const settledEvent = allEvents.find(
      (el) => el.eventName === "ClaimSettled",
    );
    if (settledEvent) {
      await db.claim.update({
        where: {
          tradeReference: tradeRef,
        },
        data: {
          hash: settledEvent.args.claimIdentifier,
          transaction: settledEvent.transactionHash,
          transactionLog: settledEvent.logIndex,
          matched: true,
          settledDate: new Date(),
          settledBy: "USER",
          settlerId: userId,
          settled: true,
        },
      });
      return "Transaction Settled";
    }
    const uploadEvent = allEvents.find((el) => el.eventName === "ClaimAdded");
    if (uploadEvent) {
      await processUploadedEvents([claimHash]);
      return "Claim Uploaded";
    }
    const errorEvent = allEvents.find(
      (el) => el.eventName === "SettlementError",
    );
    if (errorEvent) {
      const { reason } = errorEvent.args as Error;
      await db.blockchainError.create({
        data: {
          reason,
          eventName: errorEvent.eventName,
          contractAddress,
          transactionHash: errorEvent.transactionHash,
          claimId: claimId,
        },
      });
      return type === "settle" ? "Settlement Error" : "Uploading Error";
    }

    return type === "settle"
      ? "Settlement in Progress"
      : "Uploading in Progress";
  } catch (err) {
    console.log(err);
    return "Settlement Error";
  }
};
