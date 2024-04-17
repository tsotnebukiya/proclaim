import { db } from "@/server/db";
import { type DummyClaim } from "../schemas";
import { dummyEncrypt, generateHash, warsawTime } from "../utils";

export default async function processDummy(data: DummyClaim[]) {
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
