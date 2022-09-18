// src/server/router/index.ts
import { t } from "../trpc";
import { gameRouter } from "./game";
import { pitcherRouter } from "./pitcher";
import { teamRouter } from "./team";

export const appRouter = t.router({
  team: teamRouter,
  pitcher: pitcherRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
