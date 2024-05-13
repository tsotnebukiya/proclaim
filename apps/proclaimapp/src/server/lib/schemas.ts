import { z } from "zod";

export const newClaimSchema = z.object({
  tradeReference: z
    .string()
    .regex(/^\d+$/, "Trade reference must be numeric")
    .min(10, "Trade reference must be 10 digits long")
    .max(10, "Trade reference must be 10 digits long"),
  corporateAction: z.string().min(1, "You must choose event type"),
  corporateActionID: z
    .string()
    .min(5, "Event ID must be at least 5 characters long"),
  eventRate: z.number().min(0.001, "Event must have rate"),
  payDate: z.date(),
  quantity: z.number().min(0.001, "Trade must have quantity"),
  contractualSettlementDate: z.date(),
  actualSettlementDate: z.date(),
  amount: z.number().min(0.001, "Trade must have quantity"),
  counterparty: z.string().min(1, "Trade must have cp account"),
  currency: z.string(),
  type: z.union([z.literal("Payable"), z.literal("Receivable")]),
});

export type NewClaim = z.infer<typeof newClaimSchema>;

export const dummyClaimSchema = z.object({
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
  currency: z.string(),
  type: z.union([z.literal("Payable"), z.literal("Receivable")]),
  owner: z.string(),
  market: z.string(),
});

export const DummyClaimsArraySchema = z.array(dummyClaimSchema);

export type DummyClaim = z.infer<typeof dummyClaimSchema>;

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
