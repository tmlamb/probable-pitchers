// src/server/router/index.ts
import { t } from "../trpc";
import { teamRouter } from "./team";

export const appRouter = t.router({
  team: teamRouter,
});

export type AppRouter = typeof appRouter;
