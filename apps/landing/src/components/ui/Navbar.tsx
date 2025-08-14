"use client"

import { siteConfig } from "@/app/siteConfig"
import useScroll from "@/lib/useScroll"
import { useSmoothScroll } from "@/lib/useSmoothScroll"
import { cx } from "@/lib/utils"
import { RiCloseFill, RiMenuFill } from "@remixicon/react"
import Link from "next/link"
import React from "react"
import { SolarLogo } from "../../../public/SolarLogo"
import { Button } from "../Button"

export function NavBar() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(15)
  const scrollToSection = useSmoothScroll()

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault()
    scrollToSection(sectionId, 100)
    setOpen(false) // Close mobile menu if open
  }

  return (
    <header
      className={cx(
        "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl justify-center rounded-lg border border-transparent px-3 py-3 transition duration-300",
        scrolled || open
          ? "border-gray-200/50 bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-sm"
          : "bg-white/0",
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home">
            <span className="sr-only">proClaim Logo</span>
            <SolarLogo className="w-32" />
          </Link>
          <nav className="hidden sm:block md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="px-2 py-1 text-gray-900"
                href="#solutions"
                onClick={(e) => handleNavClick(e, "solutions")}
              >
                Solutions
              </Link>
              <Link
                className="px-2 py-1 text-gray-900"
                href="#demo"
                onClick={(e) => handleNavClick(e, "demo")}
              >
                Demo
              </Link>
              <Link
                className="px-2 py-1 text-gray-900"
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "how-it-works")}
              >
                How it works
              </Link>
            </div>
          </nav>
          {/* <Button
            variant="secondary"
            className="hidden h-10 font-semibold sm:block"
          >
            Watch the demo
          </Button> */}
          <Button
            onClick={() => setOpen(!open)}
            variant="secondary"
            className="p-1.5 sm:hidden"
            aria-label={open ? "CloseNavigation Menu" : "Open Navigation Menu"}
          >
            {!open ? (
              <RiMenuFill
                className="size-6 shrink-0 text-gray-900"
                aria-hidden
              />
            ) : (
              <RiCloseFill
                className="size-6 shrink-0 text-gray-900"
                aria-hidden
              />
            )}
          </Button>
        </div>
        <nav
          className={cx(
            "mt-6 flex flex-col gap-6 text-lg ease-in-out will-change-transform sm:hidden",
            open ? "" : "hidden",
          )}
        >
          <ul className="space-y-4 font-medium">
            <li>
              <Link
                href="#solutions"
                onClick={(e) => handleNavClick(e, "solutions")}
              >
                Solutions
              </Link>
            </li>
            <li>
              <Link href="#demo" onClick={(e) => handleNavClick(e, "demo")}>
                Demo
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "how-it-works")}
              >
                How it works
              </Link>
            </li>
          </ul>
          {/* <Button variant="secondary" className="text-lg">
            Watch the demo
          </Button> */}
        </nav>
      </div>
    </header>
  )
}
