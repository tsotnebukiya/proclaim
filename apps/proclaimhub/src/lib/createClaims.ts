import moment from "moment-timezone";
import { accounts } from "./owners";

export interface Claim {
  tradeReference: string;
  corporateAction: string;
  corporateActionID: string;
  eventRate: number;
  payDate: string;
  quantity: number;
  contractualSettlementDate: string;
  actualSettlementDate: string;
  amount: number;
  counterparty: string;
  owner: string;
  market: string;
  type: "Payable" | "Receivable";
  currency: string;
}

function generateClaims(
  own: string,
  cp1: string,
  lastTradeRef: number,
  market: string,
): { claims: Claim[]; lastRef: number } {
  let lastRef = lastTradeRef++;
  const claims: Claim[] = [];
  const startDate = moment.utc().startOf("day");
  // Generate matching claims for the specified owner and counterparty
  for (let i = 0; i < 15; i++) {
    const tradeReference = lastRef;
    lastRef++;
    const corporateAction =
      Math.random() < 0.5 ? "Interest Payment" : "Redemption";
    const corporateActionID = `CA${Math.floor(
      100000000 + Math.random() * 900000000,
    )}`;
    const eventRate =
      corporateAction === "Interest Payment"
        ? Math.floor(Math.random() * 50) + 1
        : 1;
    const payDate = startDate.clone().add(i + 1, "d");
    const payDateTimestamp = payDate.valueOf();
    const quantity = Math.floor(Math.random() * 1000000) + 10000; // 10,000 to 99,999 shares
    const contractualSettlementDate = payDate
      .clone()
      .subtract(Math.floor(Math.random() * 3) + 2, "days")
      .valueOf();
    const actualSettlementDate = payDate
      .clone()
      .add(Math.floor(Math.random() * 3) + 2, "days")
      .valueOf();
    const amount =
      corporateAction === "Interest Payment"
        ? (quantity / 1000) * eventRate
        : quantity;
    const counterparty = cp1;
    const owner = own;
    const type = Math.random() < 0.5 ? "Payable" : "Receivable";
    const currency = Math.random() < 0.5 ? "USDt" : "EURt";
    claims.push({
      tradeReference: tradeReference.toString(),
      corporateAction,
      corporateActionID,
      eventRate,
      payDate: payDateTimestamp.toString(),
      quantity,
      contractualSettlementDate: contractualSettlementDate.toString(),
      actualSettlementDate: actualSettlementDate.toString(),
      amount: Math.floor(amount),
      owner,
      counterparty,
      market,
      type,
      currency,
    });
  }
  return { claims, lastRef };
}

export function generateDummyClaimsData(
  lastRefRedis: number,
  market: string,
  owners: string[],
): {
  dummyClaimsData: Claim[];
  lastReference: number;
} {
  const dummyClaimsData: Claim[] = [];
  let lastReference = lastRefRedis;
  for (let i = 0; i < owners.length; i++) {
    const owner = owners[i];

    for (let j = i + 1; j < owners.length; j++) {
      const counterparty = owners[j];
      const { claims, lastRef } = generateClaims(
        owner!,
        counterparty!,
        lastReference,
        market,
      );
      lastReference = lastRef;
      const counterpartyClaims = claims.map((claim, claimI) => {
        let amount = claim.amount;
        // if (claimI === 0) {
        //   amount = claim.amount + 1000;
        // }
        const type =
          claim.type === "Payable"
            ? "Receivable"
            : ("Payable" as "Payable" | "Receivable");
        return {
          ...claim,
          owner: claim.counterparty,
          counterparty: claim.owner,
          type,
          amount,
        };
      });

      dummyClaimsData.push(...claims, ...counterpartyClaims);
    }
  }

  return { dummyClaimsData, lastReference };
}

export function groupClaimsByOwner(claims: Claim[]): Record<string, Claim[]> {
  const claimsByOwner: Record<string, Claim[]> = {};

  claims.forEach((claim) => {
    const name = accounts.find(
      (el) => el.icsd === claim.owner || el.us === claim.owner,
    )?.name!;
    if (!claimsByOwner[name]) {
      claimsByOwner[name] = [];
    }
    claimsByOwner[name]!.push(claim);
  });

  return claimsByOwner;
}
