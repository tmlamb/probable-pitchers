// src/server/router/index.ts
import { t } from "../trpc";
import { deviceRouter } from "./device";
import { pitcherRouter } from "./pitcher";
import { subscriptionRouter } from "./subscription";

export const appRouter = t.router({
  pitcher: pitcherRouter,
  subscription: subscriptionRouter,
  device: deviceRouter,
});

export type AppRouter = typeof appRouter;
