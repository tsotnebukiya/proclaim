import { keccak256 } from "thirdweb";
import moment from "moment-timezone";
import { DummyClaim, dummyClaimSchema } from "./schemas";

export function generateHash(claimString: string): string {
  const string = claimString as `0x${string}`;
  return keccak256(string);
}

const currencyRates: Record<string, number> = { EURt: 1.07 };

export function convertToUSD(amount: number, currency: string) {
  if (currency === "USDt") return amount; // No conversion needed for USD

  const rate = currencyRates[currency];
  if (!rate) throw new Error(`Exchange rate for ${currency} not found`);

  return amount * rate;
}

export const deployers: Record<string, string> = {
  "0xa1DE3190196739c5c21C6fAb50b3FaAB4dCEDF5C": "Citibank",
  "0x2D827566cf97A2e20D26799ca2c1d64E0028c92F": "JP Morgan",
  "0x25356c8F6812a7c756A74763B3096Da6e09f8e90": "Goldman",
};

export const PROCLAIM_ADDRESS = "0x874392305B2fe9783bc0A26e79DdEfF4f0083687";

export const BLOCKSCOUT_API =
  "https://sn2-stavanger-blockscout.eu-north-2.gateway.fm/api/v2";

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
export function dummyEncrypt(message: string): string {
  const encrypted = message
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
    .join("");
  return encrypted;
}

export function dummyDecrypt(encryptedMessage: string): string {
  const decrypted = encryptedMessage
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
  return decrypted;
}

export function invertDecryptedData(data: string) {
  const parts = data.split(";");
  if (parts[11] === "Receivable" || parts[11] === "Payable") {
    console.log("heyhere");
    const temp = parts[9]!;
    parts[9] = parts[12]!;
    parts[12] = temp;
    parts[11] = parts[11] === "Receivable" ? "Payable" : "Receivable";
    return parts.join(";");
  }
  const temp = parts[9]!;
  parts[9] = parts[10]!;
  parts[10] = temp;
  parts[parts.length - 1] =
    parts[parts.length - 1] === "Receivable" ? "Payable" : "Receivable";
  return parts.join(";");
}

export function excelDateToJSDate(serial: number): Date {
  // Excel date origin is January 1, 1900
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const jsDate = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
  return jsDate;
}

export function stringToClaim(dataString: string): DummyClaim | null {
  const keys = [
    "tradeReference",
    "corporateAction",
    "corporateActionID",
    "eventRate",
    "payDate",
    "quantity",
    "contractualSettlementDate",
    "actualSettlementDate",
    "amount",
    "counterparty",
    "owner",
    "market",
    "currency",
    "type",
  ];
  const newOrderKeys = [
    "tradeReference",
    "corporateAction",
    "corporateActionID",
    "eventRate",
    "payDate",
    "quantity",
    "contractualSettlementDate",
    "actualSettlementDate",
    "amount",
    "counterparty",
    "currency",
    "type",
    "owner",
    "market",
  ];
  const values = dataString.split(";");
  const resultObject = keys.reduce((obj, key, index) => {
    switch (key) {
      case "eventRate":
      case "amount":
        obj[key] = parseFloat(values[index]!);
        break;
      case "quantity":
        obj[key] = parseInt(values[index]!, 10);
        break;
      default:
        obj[key] = values[index];
    }
    return obj;
  }, {} as any);

  const object = dummyClaimSchema.safeParse(resultObject);
  if (object.success) {
    return resultObject as DummyClaim;
  }
  const resultObject1 = newOrderKeys.reduce((obj, key, index) => {
    switch (key) {
      case "eventRate":
      case "amount":
        obj[key] = parseFloat(values[index]!);
        break;
      case "quantity":
        obj[key] = parseInt(values[index]!, 10);
        break;
      default:
        obj[key] = values[index];
    }
    return obj;
  }, {} as any);
  const object1 = dummyClaimSchema.safeParse(resultObject1);
  if (object1.success) {
    return resultObject1 as DummyClaim;
  }
  return null;
}

export function claimStatus(paydate: Date, settled: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const payDateObj = new Date(paydate);
  payDateObj.setHours(0, 0, 0, 0);
  let status;
  if (payDateObj > today) {
    status = "upcoming";
  } else if (settled) {
    status = "settled";
  } else {
    status = "pending";
  }
  return status;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const warsawTime = moment.utc();

export function convertContractUnsettled(
  data: [string[], string[], bigint[], string[], string[]],
) {
  const [hashes, encryptedData, amounts, cpAddresses, currencies] = data;

  return hashes.map((hash, index) => ({
    hash: hash,
    encryptedData: encryptedData[index]!,
    amount: Number(amounts[index]),
    cpAddress: cpAddresses[index]!,
    currency: currencies[index]!,
  }));
}

export function convertContractAll(
  data: [string[], string[], bigint[], string[], string[], string[]],
) {
  const [hashes, encryptedData, amounts, settled, cpAddresses, currencies] =
    data;

  return hashes.map((hash, index) => ({
    hash: hash,
    encryptedData: encryptedData[index]!,
    amount: Number(amounts[index]),
    settled: settled[index]!,
    cpAddress: cpAddresses[index]!,
    currency: currencies[index]!,
  }));
}

export function matchEncryptedData(data: string, data1: string): boolean {
  let fields = data.split(";");
  if (fields.length !== 14) {
    throw new Error("Invalid data format");
  }
  const temp = fields[9];
  fields[9] = fields[10] ?? "";
  fields[10] = temp ?? "";
  fields[13] = fields[13] === "Payable" ? "Receivable" : "Payable";
  const newData = fields.join(";");
  return newData === data1;
}
export function delay(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}
