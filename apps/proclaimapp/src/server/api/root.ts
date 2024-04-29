import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { teamsRouter } from "./routers/teams";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { contractsRouter } from "./routers/contracts";

export const appRouter = createTRPCRouter({
  teams: teamsRouter,
  contract: contractsRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);
