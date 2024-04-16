import { db } from "@/server/db";
import { bankContract } from "proclaim";
import { kv } from "@vercel/kv";

import { getContractEvents } from "thirdweb";

export const processOwnEvents = async () => {
  const teams = await db.team.findMany();
  const contracts = teams.map((el) => el.contractAddress);
  const lastCheckedBlock = (await kv.get<number>("lastCheckedBlock")) as number;
  const allEventsRes = await Promise.all(
    contracts.map(async (contractAddress) => {
      // Assuming getContractEvents function accepts a contract address and returns events
      return getContractEvents({
        contract: bankContract(contractAddress),
        fromBlock: BigInt(lastCheckedBlock + 1),
        toBlock: "latest",
      });
    }),
  );
  const allEvents = allEventsRes.flatMap((event) => event);
  const latestBlock = allEvents.reduce(
    (max, event) => (event.blockNumber > max ? event.blockNumber : max),
    BigInt(0),
  );
  const newLatestBlock = Number(latestBlock);
  await kv.set<number>("lastCheckedBlock", newLatestBlock);
  if (!allEvents || allEvents.length === 0) {
    return null;
  }
  // Claim Uploaded
  const claimAddedEvents = allEvents.filter(
    (el) => el.eventName === "ClaimAdded",
  );
  if (claimAddedEvents.length > 0) {
    await db.claim.updateMany({
      where: {
        hash: {
          in: claimAddedEvents.map((el) => el.args.claimIdentifier),
        },
      },
      data: {
        uploaded: true,
      },
    });
  }

  // ClaimSettled

  // SettlementError
  return allEvents;
};
