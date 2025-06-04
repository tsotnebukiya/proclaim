# Proclaim AI Integration Overview

## Executive Summary (For Investors)

Proclaim streamlines the settlement of bank claims by providing a single place for teams to manage documentation and track progress. Introducing artificial intelligence can further automate routine tasks and surface insights that accelerate deals.

Key opportunities include:

- **Automated Data Extraction** – AI can read incoming claim documents and transform them into structured records, reducing manual entry.
- **Off‑Platform Counterparty Outreach** – An AI agent can detect claims involving parties that are not yet registered on Proclaim, automatically send introductory emails and reminders, and escalate unresolved cases to account managers.
- **AI-Assisted Claim Validation** – Intelligent checks can verify submitted details against trusted data sources to catch errors early.
- **Predictive Settlement Analytics** – By analyzing historical outcomes, AI can forecast timelines and expected recoveries, helping to prioritise efforts.
- **Document Summaries** – Natural language models can summarise lengthy correspondence, enabling faster review by stakeholders.

These enhancements aim to shorten settlement cycles and open new revenue opportunities for the business.

## Technical Considerations (For Developers)

The repository uses a Turborepo with two main apps: `proclaimapp` (the portal) and `proclaimhub` (the marketing site). Smart contracts and blockchain utilities live in `packages/proclaim`.

### Suggested Integration Points

1. **Claims Data Extraction**
   - Use an AI service (e.g., OpenAI API or a locally hosted model) to parse claim documents during the `uploadClaims` process found in `apps/proclaimapp/src/server/lib/claims/uploadClaims.ts`.
   - This converts unstructured files into structured data before being written to the database or pushed on-chain.

2. **Off‑Platform Counterparty Outreach**
   - Add logic in `apps/proclaimapp/src/server/lib/claims` to check whether all counterparties are registered.
   - If not, trigger an AI-powered outreach service that sends personalised emails, tracks responses and issues automated chasers.

3. **AI-Assisted Claim Validation & Classification**
   - Compare incoming claims with trusted data in `apps/proclaimapp/src/server/db.ts` or third-party sources.
   - Flag inconsistent entries and categorise claims automatically in `apps/proclaimapp/src/server/api/routers/overview.ts`.

4. **Natural Language Querying and Assistant**
   - Implement a chat or Q&A interface in `apps/proclaimapp` using TRPC API routes, enabling users to ask questions about claims or contracts.
   - A backend service would call a language model and return summaries or insights.

### Implementation Steps

1. **Select an AI Provider** – Evaluate hosted APIs (OpenAI, Anthropic) or self-hosted models. Add a new service module under `apps/proclaimapp/src/server/lib` for AI utilities.
2. **Extend Existing Upload Flow** – Modify `uploadClaims` to feed uploaded files to the AI parser before persisting.
3. **Create Validation Jobs** – Schedule periodic tasks (e.g., using CRON or a serverless function) that review newly uploaded claims, cross-check their details and log any discrepancies.
4. **Expose Results** – Enhance the dashboard UI components in `apps/proclaimapp/src/frontend/components/workspace` to display AI-derived metrics and counterparty outreach status.

This phased approach keeps AI functionality modular, allowing experimentation without disrupting existing blockchain workflows.
