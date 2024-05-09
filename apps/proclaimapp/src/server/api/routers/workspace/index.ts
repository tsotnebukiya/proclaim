import { createTRPCRouter } from "@/server/api/trpc";
import { claimRouter } from "./claims";
import { cpClaimsRouter } from "./cp-claims";

export const workspaceRouter = createTRPCRouter({
  claims: claimRouter,
  cpClaims: cpClaimsRouter,
});
