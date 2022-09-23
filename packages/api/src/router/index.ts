// src/server/router/index.ts
import { t } from "../trpc";
import { gameRouter } from "./game";
import { pitcherRouter } from "./pitcher";
import { subscriptionRouter } from "./subscription";
import { teamRouter } from "./team";
import { userRouter } from "./user";

export const appRouter = t.router({
  team: teamRouter,
  pitcher: pitcherRouter,
  game: gameRouter,
  subscription: subscriptionRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
