import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(
  address: string,
  startLength = 8,
  endLength = 6,
) {
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

export function customNumberFormatter(value: number, digits: number = 2) {
  const absValue = Math.abs(value);
  let suffix = "";
  let formattedNumber = value;

  if (absValue >= 1_000_000_000) {
    formattedNumber = value / 1_000_000_000;
    suffix = "BB";
  } else if (absValue >= 1_000_000) {
    formattedNumber = value / 1_000_000;
    suffix = "MM";
  } else if (absValue >= 1_000) {
    formattedNumber = value / 1_000;
    suffix = "KK";
  }

  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: digits,
    }).format(formattedNumber) + suffix
  );
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}
