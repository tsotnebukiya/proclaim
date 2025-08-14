import {
  RiBarChartFill,
  RiDatabase2Fill,
  RiFlashlightFill,
  RiLock2Fill,
  RiPieChartFill,
} from "@remixicon/react"
import Image from "next/image"
import { Divider } from "../Divider"
import { StickerCard } from "./StickerCard"

export function SmartContracts() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="smart-contracts"
      className="relative mx-auto w-full max-w-6xl overflow-hidden"
    >
      <div>
        <h2
          id="smart-contracts"
          className="relative scroll-my-24 text-lg font-semibold tracking-tight text-orange-500"
        >
          Smart Contracts
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 max-w-3xl text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Tokenized cash and a contract registry for automated settlement
        </p>
      </div>
      <div className="*:pointer-events-none">
        <div className="mt-4 mb-2 h-full shrink-0 overflow-hidden">
          <Image
            src={"/images/smartcontracts.svg"}
            alt="proClaim smart-contracts overview"
            className="w-full min-w-100 shrink-0"
            width={300}
            height={50}
          />
        </div>
      </div>
      <Divider className="mt-0"></Divider>
      <div className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-4 md:grid-rows-1">
        <StickerCard
          Icon={RiDatabase2Fill}
          title="Contract Registry"
          description="Issuer, contract, market and account references, token addresses, and bank public keys."
        />
        <StickerCard
          Icon={RiLock2Fill}
          title="Encrypted Claims"
          description="Only hashed IDs and encrypted claim data are written on‑chain for privacy."
        />
        <StickerCard
          Icon={RiFlashlightFill}
          title="Atomic Settlement"
          description="Counterparty calls settleClaim; contracts verify approvals and transfer USDt/EURt."
        />
        <StickerCard
          Icon={RiBarChartFill}
          title="Audit & Analytics"
          description="On‑chain events plus app telemetry for reconciliation, error tracing, and SLA reporting."
        />
      </div>
    </section>
  )
}
