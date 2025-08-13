"use client";

import Image from "next/image";

interface BankLogoProps {
  bank: string;
  className?: string;
}

export function BankLogo({ bank, className = "" }: BankLogoProps) {
  const getBankLogo = (bankName: string) => {
    switch (bankName.toUpperCase()) {
      case "JP":
        return {
          src: "/jp.png",
          alt: "JP Morgan",
          name: "JP Morgan",
        };
      case "CITI":
        return {
          src: "/citibank.png",
          alt: "Citibank",
          name: "Citibank",
        };
      case "GOLDMAN":
        return {
          src: "https://companieslogo.com/img/orig/GS-ed2c5b3b.png",
          alt: "Goldman Sachs",
          name: "Goldman Sachs",
        };
      default:
        return {
          src: "/logo.png",
          alt: "Bank",
          name: "Bank",
        };
    }
  };

  const logoInfo = getBankLogo(bank);

  return (
    <div className="flex items-center gap-2">
      <Image
        src={logoInfo.src}
        alt={logoInfo.alt}
        width={160}
        height={40}
        className={`max-h-10 w-auto object-contain ${className}`}
      />
    </div>
  );
}
