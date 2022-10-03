// src/server/router/index.ts
import { t } from "../trpc";
import { pitcherRouter } from "./pitcher";
import { subscriptionRouter } from "./subscription";

export const appRouter = t.router({
  pitcher: pitcherRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
