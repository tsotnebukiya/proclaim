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

export const createTeamSchema = z.object({
  teamName: z.string().min(5, {
    message: "Team Name must be at least 5 characters.",
  }),
  market: z.string().min(2, {
    message: "Market must be at least 2 characters.",
  }),
  account: z
    .string()
    .regex(/^\d+$/, {
      message: "Account must be a numeric value.",
    })
    .min(5, {
      message: "Account must be at least 5 characters.",
    }),
  stp: z.boolean(),
});

export type CreateTeamType = z.infer<typeof createTeamSchema>;
