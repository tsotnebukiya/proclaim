import axios from "axios";
import { getCachedContracts } from "../contracts/fetch-contracts";
import { BLOCKSCOUT_API, deployers } from "../utils";
import { env } from "@/env";
import { ScoutTokenBalance, ScoutTokenTransfer } from "../types";
import { db } from "@/server/db";

export default async function getTokenData({ token }: { token: string }) {
  const contracts = await getCachedContracts();
  const tokenContracts = contracts.filter((el) => el.type === "token");
  const tokenCount = tokenContracts.length;
  const designatedContract = tokenContracts.filter((el) =>
    el.name.toLocaleLowerCase().includes(token),
  )[0]!;
  const balancesPromise = axios.get<ScoutTokenBalance[]>(
    `${BLOCKSCOUT_API}/addresses/${env.ETH_ADDRESS}/token-balances`,
  );
  const transfersPromise = axios.get<{ items: ScoutTokenTransfer[] }>(
    `${BLOCKSCOUT_API}/addresses/${env.ETH_ADDRESS}/token-transfers?token=${designatedContract.contractAddress}`,
  );
  const claimsPromise = await db.claim.findMany({
    where: {
      settled: true,
      currency: `${token.toUpperCase()}t`,
    },
    include: {
      team: true,
    },
  });
  const [{ data: tokensBalances }, { data: tokenTransfersObject }, claims] =
    await Promise.all([balancesPromise, transfersPromise, claimsPromise]);
  const tokenTransfers = tokenTransfersObject.items.filter((el) =>
    claims.some((claim) => claim.transaction === el.tx_hash),
  );
  const tokenBalance = tokensBalances.filter(
    (el) => el.token.address === designatedContract.contractAddress,
  )[0]!;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayTransfers = tokenTransfers.filter((transfer) => {
    const transferDate = new Date(transfer.timestamp);
    return transferDate.toDateString() === today.toDateString();
  });
  const yesterdayTransfers = tokenTransfers.filter((transfer) => {
    const transferDate = new Date(transfer.timestamp);
    return transferDate.toDateString() === yesterday.toDateString();
  });
  const todayVolume =
    todayTransfers.reduce((total, transfer) => {
      const value = parseInt(transfer.total.value, 10); // Ensuring the value is an integer
      return total + value;
    }, 0) / 100;
  const yesterdayVolume =
    yesterdayTransfers.reduce((total, transfer) => {
      const value = parseInt(transfer.total.value, 10); // Ensuring the value is an integer
      return total + value;
    }, 0) / 100;

  const todayBalance = Number(tokenBalance.value) / 100;
  const yesterdayBalance =
    todayBalance -
    yesterdayTransfers.reduce((total, transfer) => {
      const value = parseInt(transfer.total.value, 10); // Ensuring the value is an integer
      if (transfer.from.hash === env.ETH_ADDRESS) {
        return total - value; // Subtract if 'from' is null
      } else {
        return total + value; // Add otherwise
      }
    }, 0) /
      100;

  const transfers = tokenTransfers.map((el) => {
    const amountVal = Number(el.total.value) / 100;
    const amount = el.from.hash === env.ETH_ADDRESS ? -amountVal : amountVal;
    const transaction = el.tx_hash;
    const log = el.log_index;
    const tofromAddress =
      el.from.hash === env.ETH_ADDRESS ? el.to.hash : el.from.hash;
    const tofrom = deployers[tofromAddress]!;
    const claimObject = claims.find(
      (claim) =>
        claim.transaction === transaction &&
        Number(log) + 1 === claim.transactionLog,
    )!;
    const claim = claimObject.tradeReference;
    const teamSlug = claimObject.team.slug;
    return { amount, tofrom, claim, teamSlug, ccy: token, transaction };
  });
  const requests = await db.tokenRequest.findMany({
    where: {
      token,
    },
  });
  return {
    generalData: {
      tokenCount,
      todayBalance,
      yesterdayBalance,
      todayVolume,
      yesterdayVolume,
    },
    transfers,
    requests,
  };
}
