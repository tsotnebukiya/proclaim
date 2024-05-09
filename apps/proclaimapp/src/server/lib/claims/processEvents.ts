import { db } from "@/server/db";
import { GetBankDetails, bankContract, depositoryContract } from "proclaim";
import { kv } from "@vercel/kv";

import { getContractEvents } from "thirdweb";
import { getAllBankDetails } from "proclaim/depositoryFunctions";
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
  const updatePromises = events.map((event) =>
    db.claim.updateMany({
      where: { hash: event.hash, settled: false },
      data: {
        settled: true,
        matched: true,
        settledBy: "SYSTEM",
        transaction: event.transactionHash,
        transactionLog: event.transactionLog,
      },
    }),
  );

  await Promise.all(updatePromises);
}

async function processSettlementErrors(cpEvents: any, claims: Claim[]) {
  const errors = cpEvents
    .filter((ev: any) => ev.eventName === "SettlementError")
    .map((ev: any) => {
      console.log(ev);
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
          transactionLog: el.transactionIndex,
        })),
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
