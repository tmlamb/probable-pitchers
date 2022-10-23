// src/server/router/index.ts
import { t } from "../trpc";
import { accountRouter } from "./account";
import { deviceRouter } from "./device";
import { pitcherRouter } from "./pitcher";
import { subscriptionRouter } from "./subscription";
import { userRouter } from "./user";

export const appRouter = t.router({
  pitcher: pitcherRouter,
  subscription: subscriptionRouter,
  device: deviceRouter,
  user: userRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
