# Overview

This repository contains a full stack monorepo for the **proClaim** application. It is managed using [Turbo](https://turbo.build/) and pnpm workspaces. The project contains a Next.js web application plus a shared TypeScript package that exposes blockchain utilities used by the app.

```
proclaim/
├─ apps/
│  └─ proclaimapp/    # main Next.js application
├─ packages/
│  ├─ proclaim        # blockchain/contract helpers
│  └─ typescript-config
```

---

## Packages

### `packages/proclaim`

This package provides code for interacting with the project’s smart contracts using the `thirdweb` library. Important files include:

- `config/config.ts` – sets up a Thirdweb client, defines the custom chain and wallet, and contains a `deployContract` helper used when creating new bank contracts.
- `config/contracts.ts` – exports helpers to access the Depository contract, token contracts (USD/EUR), and individual bank contracts. Contract ABIs are inlined here.
- `functions/*` – auto-generated contract bindings exposing read/write methods. Examples include `bankcontract.ts`, `token.ts`, and `depository.ts`.
- `index.ts` – re‑exports the configuration and typed return types.

These utilities are consumed by the application’s backend to deploy and interact with contracts.

### `packages/typescript-config`

Shared tsconfig bases for the repo (`base.json`, `nextjs.json`, etc.) are located here. They provide strict TypeScript options and are extended by the app and package tsconfigs.

---

## Application (`apps/proclaimapp`)

A Next.js 14 application written in TypeScript. It uses the App Router along with tRPC for API routes, Prisma for PostgreSQL access and NextAuth for authentication. Tailwind CSS with shadcn/tremor UI is used for styling.

### Key directories

- `src/app` – Next.js pages and API routes. Contains subfolders for auth, API engine endpoints and the main UI.
- `src/server` – Backend logic including:
  - `api/` – tRPC routers (contracts, teams, funding, overview, and workspace).
  - `db.ts` – Prisma client instantiation.
  - `auth.ts` – NextAuth configuration using the Prisma adapter.
  - `lib/` – helper modules for contracts, claims processing, token utilities, etc.
- `prisma/schema.prisma` – Database models for users, teams, claims, blockchain events and token requests.
- `public/` – static assets.
- `tailwind.config.ts` – Tailwind and tremor configuration.

### Important scripts

`package.json` provides numerous scripts for running dev environments for multiple workspaces (`dev:citi`, `dev:jp`, etc.), Prisma database commands, and linting/building. There is also a `start-database.sh` script which launches a local PostgreSQL Docker instance for development.

### Environment configuration

Environment variables are defined via the `src/env.js` module which uses `@t3-oss/env-nextjs` for type‑safe runtime validation. Variables include database URL, NextAuth credentials, Thirdweb keys, contract addresses, etc.

### API layer

The backend exposes a number of tRPC routers:

- **contractsRouter** – fetches on-chain contract details and manages token approval status.
- **fundingRouter** – retrieves token balances and allows requesting new tokens via the hub API.
- **overviewRouter** – aggregates dashboard statistics from claims and contract data.
- **teamsRouter** – CRUD operations for bank teams and toggling STP status.
- **workspaceRouter** – nested routers for claim management (`claims.ts`, `cp-claims.ts`), dashboards and event/settlement processing.

For each route, the server interacts with Prisma models, fetches blockchain data using helpers from `packages/proclaim`, and caches results in Vercel KV where needed.

### Cron/engine routes

Under `src/app/api/engine` the application defines API routes triggered by Vercel Cron as configured in `vercel.json`. These tasks upload new claims, settle outstanding ones and process blockchain events automatically.

---

## Database schema

Prisma models define entities such as `Team`, `Claim`, `BlockchainError` and `TokenRequest` along with NextAuth tables. `Claim` records store encrypted claim data, references to blockchain transactions and relations to the creating and settling users. `GlobalEvents` track actions like uploads or settlements.

---

## Blockchain interaction flow

1. **Contract deployment** – New bank contracts are deployed via `createTeam`, which uses `deployContract` from the shared package and stores the resulting address in the `Team` table.
2. **Claim upload/settlement** – Functions in `server/lib/claims` coordinate reading contract events, matching claims with counterparties and sending transactions with `thirdweb`. Nonces are persisted in Vercel KV to ensure ordered submissions.
3. **Periodic processing** – Cron routes call utilities like `processEvents`, `uploadClaims` and `settleClaims` to sync blockchain state with the database.

---

## Development

- Install dependencies with `pnpm install`.
- Launch the local database using `apps/proclaimapp/start-database.sh` and run `pnpm db:push` to apply Prisma schema.
- Start development servers with `pnpm dev` at the repo root – this runs turbo and spawns each workspace (Citi/JP/Goldman) on separate ports.

---

## Summary

The repository provides a full web platform for managing bank claims backed by smart contracts. The Next.js application offers dashboards, contract management and token interactions while the accompanying package supplies TypeScript wrappers for the on-chain contracts. Data is stored in Postgres via Prisma and background cron jobs keep the on-chain state in sync. Overall, the project integrates blockchain operations with a modern TypeScript/React stack for a multi-team financial workflow.

