"use client";

import { cn } from "@/frontend/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { DummyLogo } from "./dummy-logo";

export function Navigation() {
  return (
    <header
      className={cn(
        "shadow-navigation backdrop-blur-nav animate-slide-down-fade ease-[cubic-bezier(0.16,1,0.3,1.03)] fixed inset-x-3 top-4 z-50 mx-auto flex h-16 max-w-7xl transform-gpu justify-center overflow-hidden rounded-xl border border-gray-100 border-transparent bg-white/80 px-3 py-3 transition-all duration-300 will-change-transform dark:border-white/15 dark:bg-black/70",
      )}
      // style="box-shadow: 0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);"
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <span className="sr-only">proClaim logo</span>
            <DummyLogo className="w-28 md:w-32" />
          </Link>
          <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href="/"
              >
                Home
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href="/about"
              >
                About
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href="/portal"
              >
                Application
              </Link>
            </div>
          </nav>
          <Link
            href={"/auth"}
            className={buttonVariants({ variant: "default" })}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
