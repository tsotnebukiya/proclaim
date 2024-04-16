import { keccak256 } from "thirdweb";

export function generateHash(claimString: string): string {
  const string = claimString as `0x${string}`;
  return keccak256(string);
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

export function matchEncryptedData(data: string, data1: string): boolean {
  console.log(data);
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
