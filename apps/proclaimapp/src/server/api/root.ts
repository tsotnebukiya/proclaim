import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { dummyRouter } from "./routers/dummy";

export const appRouter = createTRPCRouter({
  post: postRouter,
  dummy: dummyRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
