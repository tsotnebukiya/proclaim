# Copilot Instructions for this repo

This file gives GitHub Copilot the context it needs to generate high‑quality code and guidance for this monorepo.

## Project overview

- Name: Proclaim — interbank corporate-action claims settlement (blockchain + web apps)
- Monorepo: pnpm workspaces + Turborepo
- Apps
  - apps/proclaimapp: bank app (deployed 3x: Citi, JPM, Goldman), Next.js 14 App Router, tRPC, Prisma, NextAuth
  - apps/proclaimhub: hub app that generates/distributes demo claims to banks
- Shared package
  - packages/proclaim: Thirdweb client, chain config, and generated contract helpers
- Blockchain
  - EVM-compatible testnet via Thirdweb
  - Contracts: BankDepository, BankContract, StableCoin (2 decimals)

## Tech baseline and libraries

- Frontend: Next.js 14 (App Router), React 18, TypeScript, Tailwind, Radix UI
- Backend: tRPC, Prisma ORM (PostgreSQL), NextAuth (Google), Zod env validation (@t3-oss/env-nextjs)
- Chain: thirdweb SDK for reads/writes; avoid raw ethers unless necessary
- Tooling: pnpm, turborepo, Prettier, Tailwind

## Environment variables (authoritative)

Bank app (apps/proclaimapp/src/env.js) requires:

- DATABASE_URL (Postgres)
- NODE_ENV
- NEXTAUTH_SECRET, NEXTAUTH_URL
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- THIRDWEB_CLIENT_ID, THIRDWEB_SECRET_KEY
- ETH_ADDRESS
- PROCHAIN_PUBLIC_KEY, PROCHAIN_PRIVATE_KEY
- PROCHAIN_DEPOSITORY_CONTRACT
- PROCHAIN_ID, PROCHAIN_RPC_URL
- HUB_API
- USD_CONTRACT, EUR_CONTRACT

Hub app (apps/proclaimhub/src/env.js) requires:

- NODE_ENV, NEXTAUTH_SECRET, NEXTAUTH_URL
- THIRDWEB_CLIENT_ID, THIRDWEB_SECRET_KEY
- PROCHAIN_PRIVATE_KEY
- PROCHAIN_DEPOSITORY_CONTRACT
- PROCHAIN_ID, PROCHAIN_RPC_URL
- KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN, KV_REST_API_READ_ONLY_TOKEN
- CITI_API, JP_API, GOLDMAN_API
- USD_CONTRACT, EUR_CONTRACT

Notes

- Do not reinvent env validation; use the existing env.js modules and Zod.
- Prefer adding new keys to env.js files and referencing via process.env through those modules.

## Database and schema (Prisma)

- Location: apps/proclaimapp/prisma/schema.prisma
- Core models: Team, Claim, GlobalEvents, BlockchainError, TokenRequest, NextAuth models
- Claim state: created/uploaded/matched/settled/failed are represented by flags and dates; a future “off‑chain settled” can be a boolean or derived from GlobalEvents + artifacts
- Always run Prisma migrations against each bank’s database (separate DATABASE_URL per deployment)

## Contracts and chain access

- Chain/config: packages/proclaim/config/config.ts defines thirdweb client and chain via env (PROCHAIN_ID, PROCHAIN_RPC_URL)
- Contract instances: packages/proclaim/config/contracts.ts
  - depositoryContract(): registry (bank details, token addresses)
  - tokenContract('USD'|'EUR'): StableCoin (2 decimals)
  - bankContract(address): per‑bank settlement contract
- Generated helpers (preferred usage): packages/proclaim/functions/
  - bankcontract.ts, depository.ts, token.ts (read/write helpers with typed params and prepared tx)
- Guidance
  - Use generated helpers for reads/writes instead of ad‑hoc ABI fragments
  - Post on‑chain “off‑chain receipt hash” via existing attach/hash patterns on the claim route (when implemented)

## Coding conventions

- TypeScript strict where possible; prefer explicit types on public functions
- Server code in app routes and tRPC routers; keep React Server Components default and mark client components with 'use client'
- Validation with Zod; narrow unknown inputs at boundaries
- Keep UI in frontend/components; compose small, typed components with Tailwind classes
- Error handling: bubble blockchain errors to BlockchainError table with tx hash and reason
- Avoid adding large new deps; prefer stdlib, thirdweb, zod, prisma, trpc already in use

## Typical tasks for Copilot (do this style)

- Extend tRPC routers (apps/proclaimapp/server/api or apps/proclaimapp/trpc) for:
  - Claim upload, match, settle on‑chain (batch), attach hash receipts
  - Dashboard stats (counts, sums, times)
- UI pages under apps/proclaimapp/src/app/portal for:
  - Claims table, claim detail view
  - “AI Ops Console” (see below) — left list, center thread, right actions
- Hub endpoints to generate demo data and distribute to bank APIs
- Contract integration via packages/proclaim/functions helpers; prepare tx then send with thirdweb

## AI Ops Console MVP (investor demo scope)

Goal: when counterparty is not on network, the agent orchestrates an off‑chain flow and closes the claim.

- Centerpiece UI: chat‑like thread per Claim, plus actions and artifacts
- Real: outbound email (SMTP/service) + inbound webhook to capture replies
- Emulated: wire/MT566 — generate JSON and a printable PDF; store and hash
- On‑chain: write keccak256 hash of final settlement JSON as an audit receipt

Suggested minimal implementation

- Data
  - New tables: Messages (thread), Artifacts (files + type + hash), optionally OffChainSettlement
  - Reuse GlobalEvents for timeline cards (CREATE/UPLOAD/SETTLE/UPDATE)
- API
  - POST /api/agent/start?claimId=... → kicks workflow when CP not registered
  - POST /api/agent/inbound-email (webhook) → add message, parse, validate
  - POST /api/agent/generate-artifacts → MT566 stub + payment stub (store + hash)
  - POST /api/agent/post-receipt → push hash on‑chain and mark off‑chain settled
- UI
  - apps/proclaimapp/src/app/portal/(workspace)/ai-ops/page.tsx
  - Left: claims filtered by “needs off‑chain”
  - Center: thread (Agent/Operator/CP via email proxy), inline attachments
  - Right: actions (send chaser, accept, generate MT566, post receipt)

Implementation constraints

- Keep email provider pluggable; store minimal headers/body and link attachments
- Parsing can be naive or form‑based (link in email)
- Do not block on real Swift; MT566 is a shaped JSON + PDF view

## How Copilot should decide and suggest

Prefer

- Contract calls via packages/proclaim/functions/\* with typed params
- Database access via Prisma client; respect model relations (Claim.team)
- Env access via env.js per app
- tRPC for server endpoints and React Query hooks, or route handlers if simpler
- Small, typed React components; Tailwind utility classes

Avoid

- Introducing raw ethers if thirdweb helper exists
- New infra (Kafka, Redis) for MVP; use Postgres + existing KV only if already configured
- Writing secrets to repo; use env vars
- Breaking monorepo structure or cross‑package imports that bypass packages/proclaim

## File map (pointers Copilot can use)

- apps/proclaimapp/src/app: Next app routes, layouts, pages
- apps/proclaimapp/server and apps/proclaimapp/trpc: API, routers, server glue
- apps/proclaimapp/prisma/schema.prisma: DB schema
- apps/proclaimhub/src/app: hub endpoints (e.g., /api/generateclaims)
- packages/proclaim/config: thirdweb client and contract instances
- packages/proclaim/functions: generated read/write helpers for contracts

## Deployment notes (for suggestions)

- Default target: Vercel for both apps; separate Postgres per bank app instance
- Chain: public testnet (e.g., Sepolia) via PROCHAIN\_\* envs, or a local devnet for backup
- Contracts: deploy depository + per‑bank BankContract; register banks; mint StableCoin balances for demo
- Hub: can seed demo claims to each bank API via CITI_API/JP_API/GOLDMAN_API

## Definition of done (for PRs Copilot helps write)

- Builds pass locally (pnpm, Next.js) and types check
- Prisma schema changes include migration and minimal seed if needed
- New env vars added to the appropriate env.js with Zod
- Contract interactions covered by a tiny integration call path + error logging
- UI has basic loading/error states; no unhandled promise rejections

## House style

- Commit messages: concise imperative (“add AI ops thread model; webhook handler”)
- Naming: lowerCamelCase for variables, UpperCamelCase for React components
- Dates: ISO strings in API; format in UI only
- Currency: amounts stored as numeric (float/int) in DB; convert to smallest unit on‑chain (2 decimals)

## Quick snippets for Copilot to reuse

- Get a bank contract and call a read
  - Use packages/proclaim/config/contracts.ts → bankContract(address)
  - Use packages/proclaim/functions/bankcontract.ts → readContract helper
- Push an artifact hash on‑chain
  - Compute keccak256 of JSON; write via a dedicated method or reuse attach/hash handler; store tx hash on Claim

## Security notes

- Never log private keys or secrets
- Use NextAuth session on server actions; gate mutations on team/workspace
- Sanitize email/webhook payloads; store raw + parsed versions

Thanks! Keep suggestions within these boundaries for faster merges and a great demo.
