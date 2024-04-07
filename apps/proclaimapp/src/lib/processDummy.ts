import { type DummyClaim } from "./schemas";
import { dummyEncrypt, generateHash } from "./utils";

export default function processDummy(data: DummyClaim[]) {
  return data.map((el) => {
    const string = Object.values(el).join(";");
    const encryptedClaimData = dummyEncrypt(string);
    const hash =
      el.type === "Receivable" ? generateHash(encryptedClaimData) : undefined;
    const createdDate = new Date();
    return {
      ...el,
      encryptedClaimData,
      hash,
      createdDate,
      settled: false,
    };
  });
}
