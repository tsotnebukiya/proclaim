import { createTRPCRouter } from "@/server/api/trpc";
import { claimRouter } from "./claims";
import { cpClaimsRouter } from "./cp-claims";
import { dashboardRouter } from "./dashboard";

export const workspaceRouter = createTRPCRouter({
  claims: claimRouter,
  cpClaims: cpClaimsRouter,
  dashboard: dashboardRouter,
});
