import { Claim } from "@prisma/client";
import { Contract } from "../contracts/fetch-contracts";
import { claimStatus, convertToUSD } from "../utils";
import moment from "moment-timezone";

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
        color: `bg-${true ? "blue" : i === 1 ? "cyan" : "indigo"}-500`,
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

type GroupStats = {
  totalAmount: number;
  share: number;
};

type Group = {
  [key: string]: GroupStats;
};

const addToGroup = (
  group: Group,
  key: string,
  amount: number,
  contracts: Contract[],
  cp?: boolean,
) => {
  if (!cp) {
    if (!group[key]) {
      group[key] = { totalAmount: 0, share: 0 };
    }
    group[key]!.totalAmount += amount;
  }
  if (cp) {
    const name = contracts.find((el) => String(el.account) === key)?.name;
    if (!name) {
      return;
    }
    if (!group[name]) {
      group[name] = { totalAmount: 0, share: 0 };
    }
    group[name]!.totalAmount += amount;
  }
};

const calculateShares = (group: Group, totalAmount: number) => {
  for (const key in group) {
    group[key]!.share = group[key]!.totalAmount / totalAmount;
  }
};

export function groupUpcoming(claims: Claim[], contracts: Contract[]) {
  const warsawTime = moment.utc();
  const tomorrow = warsawTime.add(1, "day").startOf("day").toDate();
  const sixDaysLater = warsawTime.add(6, "day").endOf("day").toDate();
  const endOfMonth = warsawTime.endOf("month").toDate();
  const tomorrowMs = tomorrow.getTime();
  const sixDaysLaterMs = sixDaysLater.getTime();
  const endOfMonthMs = endOfMonth.getTime();

  const claimsByCounterparty: {
    tomorrow: Group;
    wholeWeek: Group;
    wholeMonth: Group;
  } = {
    tomorrow: {},
    wholeWeek: {},
    wholeMonth: {},
  };
  const counterpartyTotals: CounterpartyTotals = {};
  claims.forEach((claim) => {
    const key = claim.counterparty;
    if (!counterpartyTotals[key]) {
      counterpartyTotals[key] = 0;
    }
    counterpartyTotals[key] +=
      claim.currency === "USDt"
        ? claim.amount
        : convertToUSD(claim.amount, "EURt");
  });

  // Identify the top three counterparties
  const largestCounterparties = Object.keys(counterpartyTotals)
    .sort((a, b) => (counterpartyTotals[b] || 0) - (counterpartyTotals[a] || 0))
    .slice(0, 3);
  const claimsByCorporateAction: {
    tomorrow: Group;
    wholeWeek: Group;
    wholeMonth: Group;
  } = {
    tomorrow: {},
    wholeWeek: {},
    wholeMonth: {},
  };

  let totalAmountTomorrow = 0;
  let totalAmountWholeWeek = 0;
  let totalAmountWholeMonth = 0;

  claims.forEach((claim) => {
    if (!largestCounterparties.includes(claim.counterparty)) {
      return;
    }
    const payDateMs = moment(claim.payDate)
      .utc()
      .startOf("day")
      .toDate()
      .getTime();
    const amount =
      claim.currency === "USDt"
        ? claim.amount
        : convertToUSD(claim.amount, "EURt");

    const isTomorrow = payDateMs == tomorrowMs;
    const isWholeWeek = payDateMs >= tomorrowMs && payDateMs <= sixDaysLaterMs;
    const isWholeMonth = payDateMs >= tomorrowMs && payDateMs <= endOfMonthMs;

    if (isTomorrow) {
      addToGroup(
        claimsByCounterparty.tomorrow,
        claim.counterparty,
        amount,
        contracts,
        true,
      );
      addToGroup(
        claimsByCorporateAction.tomorrow,
        claim.corporateAction,
        amount,
        contracts,
      );
      totalAmountTomorrow += amount;
    }

    if (isWholeWeek) {
      addToGroup(
        claimsByCounterparty.wholeWeek,
        claim.counterparty,
        amount,
        contracts,
        true,
      );
      addToGroup(
        claimsByCorporateAction.wholeWeek,
        claim.corporateAction,
        amount,
        contracts,
      );
      totalAmountWholeWeek += amount;
    }
    if (isWholeMonth) {
      addToGroup(
        claimsByCounterparty.wholeMonth,
        claim.counterparty,
        amount,
        contracts,
        true,
      );
      addToGroup(
        claimsByCorporateAction.wholeMonth,
        claim.corporateAction,
        amount,
        contracts,
      );
      totalAmountWholeMonth += amount;
    }
  });

  calculateShares(claimsByCounterparty.tomorrow, totalAmountTomorrow);
  calculateShares(claimsByCounterparty.wholeWeek, totalAmountWholeWeek);
  calculateShares(claimsByCounterparty.wholeMonth, totalAmountWholeMonth);
  calculateShares(claimsByCorporateAction.tomorrow, totalAmountTomorrow);
  calculateShares(claimsByCorporateAction.wholeWeek, totalAmountWholeWeek);
  calculateShares(claimsByCorporateAction.wholeMonth, totalAmountWholeMonth);

  return {
    byCounterparty: claimsByCounterparty,
    byCorporateAction: claimsByCorporateAction,
  };
}

type SubGroup = {
  lending: number;
  ca: number;
};

type GroupOld = {
  settled: SubGroup;
  pending: SubGroup;
};

export function groupOld(claims: Claim[], contracts: Contract[]) {
  const warsawTime = moment.utc();
  const endOfToday = warsawTime.clone().endOf("day").toDate();
  const startOfToday = warsawTime.clone().startOf("day").toDate();
  const endOfYesterday = warsawTime
    .clone()
    .subtract(1, "day")
    .endOf("day")
    .toDate();
  const startOfYesterday = warsawTime
    .clone()
    .subtract(1, "day")
    .startOf("day")
    .toDate();
  const endOfTwoDaysAgo = warsawTime
    .clone()
    .subtract(2, "day")
    .endOf("day")
    .toDate();
  const startOfTwoDaysAgo = warsawTime
    .clone()
    .subtract(2, "day")
    .startOf("day")
    .toDate();
  const endOfThreeDaysAgo = warsawTime
    .clone()
    .subtract(3, "day")
    .endOf("day")
    .toDate();
  const startOfThreeDaysAgo = warsawTime
    .clone()
    .subtract(3, "day")
    .startOf("day")
    .toDate();
  const endOfFourDaysAgo = warsawTime
    .clone()
    .subtract(4, "day")
    .endOf("day")
    .toDate();
  const startOfFourDaysAgo = warsawTime
    .clone()
    .subtract(4, "day")
    .startOf("day")
    .toDate();
  const endOfFiveDaysAgo = warsawTime
    .clone()
    .subtract(5, "day")
    .endOf("day")
    .toDate();
  const startOfFiveDaysAgo = warsawTime
    .clone()
    .subtract(5, "day")
    .startOf("day")
    .toDate();
  const endOfSixDaysAgo = warsawTime
    .clone()
    .subtract(6, "day")
    .endOf("day")
    .toDate();
  const startOfSixDaysAgo = warsawTime
    .clone()
    .subtract(6, "day")
    .startOf("day")
    .toDate();
  console.log(
    endOfToday,
    startOfToday,
    endOfYesterday,
    startOfYesterday,
    endOfTwoDaysAgo,
    startOfTwoDaysAgo,
    endOfThreeDaysAgo,
    startOfThreeDaysAgo,
    endOfFourDaysAgo,
    startOfFourDaysAgo,
    endOfFiveDaysAgo,
    startOfFiveDaysAgo,
    endOfSixDaysAgo,
    startOfSixDaysAgo,
  );

  const claimsByCorporateAction: {
    today: GroupOld;
    yesterday: GroupOld;
    twoDaysAgo: GroupOld;
    threeDaysAgo: GroupOld;
    fourDaysAgo: GroupOld;
    fiveDaysAgo: GroupOld;
    sixDaysAgo: GroupOld;
  } = {
    today: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    yesterday: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    twoDaysAgo: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    threeDaysAgo: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    fourDaysAgo: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    fiveDaysAgo: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
    sixDaysAgo: {
      settled: { lending: 0, ca: 0 },
      pending: { lending: 0, ca: 0 },
    },
  };
  claims.forEach((claim, i) => {
    const claimDate = new Date(claim.payDate);
    const status = claim.settled ? "settled" : "pending";
    const type = claim.corporateAction === "Redemption" ? "lending" : "ca";

    if (claimDate >= startOfToday && claimDate <= endOfToday) {
      claimsByCorporateAction.today[status][type]++;
    } else if (claimDate >= startOfYesterday && claimDate <= endOfYesterday) {
      // console.log(claim.tradeReference, "yesterday", type);
      claimsByCorporateAction.yesterday[status][type]++;
    } else if (claimDate >= startOfTwoDaysAgo && claimDate <= endOfTwoDaysAgo) {
      // console.log(claim.tradeReference, "2d", type);
      claimsByCorporateAction.twoDaysAgo[status][type]++;
    } else if (
      claimDate >= startOfThreeDaysAgo &&
      claimDate <= endOfThreeDaysAgo
    ) {
      // console.log(claim.tradeReference, "3d", type);
      claimsByCorporateAction.threeDaysAgo[status][type]++;
    } else if (
      claimDate >= startOfFourDaysAgo &&
      claimDate <= endOfFourDaysAgo
    ) {
      // console.log(claim.tradeReference, "4d", type);
      claimsByCorporateAction.fourDaysAgo[status][type]++;
    } else if (
      claimDate >= startOfFiveDaysAgo &&
      claimDate <= endOfFiveDaysAgo
    ) {
      // console.log(claim.tradeReference, "5d", type);
      claimsByCorporateAction.fiveDaysAgo[status][type]++;
    } else if (claimDate >= startOfSixDaysAgo && claimDate <= endOfSixDaysAgo) {
      // console.log(claim.tradeReference, "6d", type);
      claimsByCorporateAction.sixDaysAgo[status][type]++;
    }
  });
  console.log(claimsByCorporateAction);
  return claimsByCorporateAction;
}
