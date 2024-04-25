"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

const dummyArray = [
  { title: "Overview", url: "/portal" },
  { title: "Teams", url: "/portal/teams" },
  { title: "Smart Contracts", url: "/portal/contracts" },
  { title: "Funding", url: "/portal/funding" },
  {
    title: "Block Explorer",
    url: "https://sn2-stavanger-blockscout.eu-north-2.gateway.fm/",
  },
  { title: "Settings", url: "/portal/settings" },
];

export default function NavMenu() {
  const pathname = usePathname();
  return (
    <div className="flex">
      {dummyArray.map((el, i) => (
        <div
          key={i}
          className={pathname === el.url ? `border-b-2 border-black` : ""}
        >
          <Link
            className={cn(
              buttonVariants({ variant: "nav" }),
              pathname === el.url ? `text-foreground` : "",
            )}
            href={el.url}
            target={el.title === "Block Explorer" ? "_blank" : ""}
          >
            {el.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
