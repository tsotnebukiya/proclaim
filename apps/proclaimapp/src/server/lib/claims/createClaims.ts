import { db } from "@/server/db";
import { NewClaim, type DummyClaim } from "../schemas";
import {
  dummyDecrypt,
  dummyEncrypt,
  generateHash,
  stringToClaim,
  warsawTime,
} from "../utils";
import moment from "moment-timezone";

export async function processDummy(data: DummyClaim[]) {
  const teams = await db.team.findMany();
  const array = data.map((el) => {
    const string = Object.values(el).join(";");
    const encryptedClaimData = dummyEncrypt(string);
    const hash =
      el.type === "Receivable" ? generateHash(encryptedClaimData) : undefined;
    const createdDate = warsawTime.toDate();
    const payDate = new Date(parseInt(el.payDate));
    const contractualSettlementDate = new Date(
      parseInt(el.contractualSettlementDate),
    );
    const actualSettlementDate = new Date(parseInt(el.actualSettlementDate));
    const teamId = teams.find(
      (team) => `${team.account}${team.market}` === `${el.owner}${el.market}`,
    )?.id;
    if (!teamId) {
      return undefined;
    }
    return {
      ...el,
      encryptedClaimData,
      hash,
      createdDate,
      teamId,
      payDate,
      contractualSettlementDate,
      actualSettlementDate,
      tradeReference: el.tradeReference,
      uploaded: el.type === "Receivable" ? false : undefined,
    };
  });
  const filteredArray = array.flatMap((el) => (el?.teamId ? [el] : []));
  return filteredArray;
}
export async function createClaim({
  data,
  workspace,
  userId,
}: {
  data: NewClaim;
  workspace: string;
  userId: string;
}) {
  const team = await db.team.findFirstOrThrow({
    where: {
      slug: workspace,
    },
  });
  const {
    actualSettlementDate: asd,
    amount,
    contractualSettlementDate: csd,
    corporateAction,
    corporateActionID,
    counterparty,
    currency,
    eventRate,
    payDate: pd,
    quantity,
    tradeReference,
    type,
  } = data;
  const string = Object.values({
    tradeReference,
    corporateAction,
    corporateActionID,
    eventRate,
    pd: pd.getTime(),
    quantity,
    csd: csd.getTime(),
    asd: asd.getTime(),
    amount,
    counterparty,
    owner: String(team.account),
    market: team.market,
    currency,
    type,
  }).join(";");
  const encryptedClaimData = dummyEncrypt(string);
  const hash =
    data.type === "Receivable" ? generateHash(encryptedClaimData) : undefined;
  const createdDate = warsawTime.toDate();
  const payDate = moment(data.payDate).utc().startOf("day").toDate();
  const contractualSettlementDate = moment(data.contractualSettlementDate)
    .utc()
    .startOf("day")
    .toDate();
  const actualSettlementDate = moment(data.actualSettlementDate)
    .utc()
    .startOf("day")
    .toDate();
  const teamId = team.id;
  const uploadClaim = {
    ...data,
    eventRate: Number(data.eventRate),
    amount: Number(data.amount),
    quantity: Number(data.quantity),
    encryptedClaimData,
    hash,
    createdDate,
    teamId,
    payDate,
    contractualSettlementDate,
    actualSettlementDate,
    tradeReference: data.tradeReference,
    uploaded: data.type === "Receivable" ? false : undefined,
  };
  return await db.claim.create({
    data: {
      ...uploadClaim,
      createdBy: "USER",
      creatorId: userId,
      owner: String(team.account),
      market: team.market,
    },
  });
}
