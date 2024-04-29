import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { dummyRouter } from "./routers/dummy";
import { teamsRouter } from "./routers/teams";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = createTRPCRouter({
  post: postRouter,
  dummy: dummyRouter,
  teams: teamsRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);
