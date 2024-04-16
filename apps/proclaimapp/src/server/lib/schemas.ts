import { z } from "zod";

const DummyClaimSchema = z.object({
  tradeReference: z.string(),
  corporateAction: z.string(),
  corporateActionID: z.string(),
  eventRate: z.number(),
  payDate: z.string(),
  quantity: z.number(),
  contractualSettlementDate: z.string(),
  actualSettlementDate: z.string(),
  amount: z.number(),
  counterparty: z.string(),
  owner: z.string(),
  market: z.string(),
  currency: z.string(),
  type: z.union([z.literal("Payable"), z.literal("Receivable")]),
});

export const DummyClaimsArraySchema = z.array(DummyClaimSchema);

export type DummyClaim = z.infer<typeof DummyClaimSchema>;
