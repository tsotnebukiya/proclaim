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
