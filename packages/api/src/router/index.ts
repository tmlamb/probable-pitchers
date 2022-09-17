// src/server/router/index.ts
import { t } from "../trpc";
import { pitcherRouter } from "./pitcher";
import { teamRouter } from "./team";

export const appRouter = t.router({
  team: teamRouter,
  pitcher: pitcherRouter,
});

export type AppRouter = typeof appRouter;
