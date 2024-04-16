import { db } from "@/server/db";
import { type DummyClaim } from "../schemas";
import { dummyEncrypt, generateHash } from "../utils";

export default async function processDummy(data: DummyClaim[]) {
  const teams = await db.team.findMany();
  const array = data.map((el) => {
    const string = Object.values(el).join(";");
    const encryptedClaimData = dummyEncrypt(string);
    const hash =
      el.type === "Receivable" ? generateHash(encryptedClaimData) : undefined;
    const createdDate = new Date();
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
    };
  });
  const filteredArray = array.flatMap((el) => (el?.teamId ? [el] : []));
  return filteredArray;
}
