import { Claim } from "@prisma/client";
import { Contract } from "../contracts/fetch-contracts";
import { claimStatus, convertToUSD } from "../utils";

type GroupedClaims = {
  [month: string]: {
    [counterpartyMarket: string]: number;
  };
};

type CounterpartyTotals = {
  [counterpartyMarket: string]: number;
};

type TotalCounterpartyValue = {
  name: string;
  value: string;
  color: string;
};

function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  } else {
    return `$${value}`;
  }
}

export function getBarChartData(claims: Claim[], contracts: Contract[]) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Filter claims from the last 6 months
  const recentClaims = claims.filter(
    (claim) => new Date(claim.payDate) >= sixMonthsAgo,
  );

  // Group claims by month, counterparty, and market
  const groupedClaims: GroupedClaims = {};
  recentClaims.forEach((claim) => {
    const month = new Date(claim.payDate).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const key = `${claim.counterparty}-${claim.market}`;
    if (!groupedClaims[month]) {
      groupedClaims[month] = {};
    }
    const groupedClaimsMonth = groupedClaims[month];
    if (!groupedClaimsMonth![key]) {
      groupedClaims[month]![key] = 0;
    }
    groupedClaims[month]![key] += claim.amount;
  });

  // Identify the three largest counterparties (counterparty-market combinations)
  const counterpartyTotals: CounterpartyTotals = {};
  recentClaims.forEach((claim) => {
    const key = `${claim.counterparty}-${claim.market}`;
    if (!counterpartyTotals[key]) {
      counterpartyTotals[key] = 0;
    }
    counterpartyTotals[key] += claim.amount;
  });

  const largestCounterparties = Object.keys(counterpartyTotals)
    .sort((a, b) => (counterpartyTotals[b] || 0) - (counterpartyTotals[a] || 0))
    .slice(0, 3);

  // Construct the output array for bar chart data
  const result = [];
  for (const [month, counterpartyData] of Object.entries(groupedClaims)) {
    const monthData: { date: string; [key: string]: number | string } = {
      date: month,
    };
    largestCounterparties.forEach((cp) => {
      const contract = contracts.find(
        (contract) => `${contract.account}-${contract.market}` === cp,
      );
      if (!contract) {
        return;
      }
      monthData[contract.name] = counterpartyData[cp] || 0;
    });
    result.push(monthData);
  }
  result.reverse();
  // Construct the output array for total values of the top 3 counterparties
  const totalValues: TotalCounterpartyValue[] = largestCounterparties.map(
    (cp, i) => {
      const contract = contracts.find(
        (contract) => `${contract.account}-${contract.market}` === cp,
      );
      return {
        color: `bg-${i === 0 ? "blue" : i === 1 ? "cyan" : "indigo"}-500`,
        name: contract?.name || cp,
        value: formatCurrency(counterpartyTotals[cp] || 0),
      };
    },
  );
  const topCounterpartyNames = largestCounterparties.map((cp) => {
    const contract = contracts.find(
      (contract) => `${contract.account}-${contract.market}` === cp,
    );
    return contract ? contract.name : cp;
  });
  return { barChartData: result, totalValues, topCounterpartyNames };
}

type ClaimStatusData = {
  settled: number;
  pending: number;
  upcoming: number;
  totalAmount: number;
  settledPercentage: number;
  pendingPercentage: number;
  upcomingPercentage: number;
};

type GroupedByType = {
  payable: ClaimStatusData;
  receivable: ClaimStatusData;
};

export function groupClaimsByTypeAndStatus(claims: Claim[]) {
  const groupedClaims: GroupedByType = {
    payable: {
      settled: 0,
      pending: 0,
      upcoming: 0,
      totalAmount: 0,
      settledPercentage: 0,
      pendingPercentage: 0,
      upcomingPercentage: 0,
    },
    receivable: {
      settled: 0,
      pending: 0,
      upcoming: 0,
      totalAmount: 0,
      settledPercentage: 0,
      pendingPercentage: 0,
      upcomingPercentage: 0,
    },
  };

  claims.forEach((claim) => {
    const type = claim.type === "Payable" ? "payable" : "receivable";
    const status = claimStatus(new Date(claim.payDate), claim.settled);
    groupedClaims[type][status] += convertToUSD(claim.amount, claim.currency);
    groupedClaims[type].totalAmount += convertToUSD(
      claim.amount,
      claim.currency,
    );
  });

  // Calculate the percentages
  Object.keys(groupedClaims).forEach((type) => {
    const data = groupedClaims[type as keyof GroupedByType];
    const totalAmount = data.totalAmount;
    if (totalAmount > 0) {
      data.settledPercentage = (data.settled / totalAmount) * 100;
      data.pendingPercentage = (data.pending / totalAmount) * 100;
      data.upcomingPercentage = (data.upcoming / totalAmount) * 100;
    }
  });

  return groupedClaims;
}
