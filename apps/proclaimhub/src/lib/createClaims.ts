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
  const startDate = new Date(); // Current date
  // Generate matching claims for the specified owner and counterparty
  for (let i = 0; i < 2; i++) {
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
    const payDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1,
    );
    const quantity = Math.floor(Math.random() * 1000000) + 10000; // 10,000 to 99,999 shares
    const contractualSettlementDate = new Date(payDate);
    contractualSettlementDate.setDate(
      contractualSettlementDate.getDate() - Math.floor(Math.random() * 3) - 2,
    );
    const actualSettlementDate = new Date(payDate);
    actualSettlementDate.setDate(
      actualSettlementDate.getDate() + Math.floor(Math.random() * 3) + 2,
    );
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
      payDate: payDate.getTime().toString(),
      quantity,
      contractualSettlementDate: contractualSettlementDate.getTime().toString(),
      actualSettlementDate: actualSettlementDate.getTime().toString(),
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
      const counterpartyClaims = claims.map((claim) => {
        const type =
          claim.type === "Payable"
            ? "Receivable"
            : ("Payable" as "Payable" | "Receivable");
        return {
          ...claim,
          owner: claim.counterparty,
          counterparty: claim.owner,
          type,
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
