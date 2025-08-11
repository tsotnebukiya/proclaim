"use client";

import Link from "next/link";
import { buttonVariants } from "../components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

const dummyArray = [
  { title: "Overview", url: "/portal" },
  { title: "Teams", url: "/portal/teams" },
  { title: "Smart Contracts", url: "/portal/contracts" },
  { title: "Funding", url: "/portal/funding/usd" },
  {
    title: "Block Explorer",
    url: "https://explorer.stavanger.gateway.fm/",
  },
  // { title: "Settings", url: "/portal/settings" },
];

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="flex">
      {dummyArray.map((el, i) => {
        const pathSegments = el.url.split("/");
        const path = `${pathSegments[1]}/${pathSegments[2]}`;
        const isHome = pathname === "/portal" && el.url === "/portal";
        const isActive = el.url !== "/portal" && pathname.includes(path);
        return (
          <div
            key={i}
            className={isHome || isActive ? `border-b-2 border-black` : ""}
          >
            <Link
              className={cn(
                buttonVariants({ variant: "nav" }),
                isHome || isActive ? `text-foreground` : "",
              )}
              href={el.url}
              target={el.title === "Block Explorer" ? "_blank" : ""}
            >
              {el.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
