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
