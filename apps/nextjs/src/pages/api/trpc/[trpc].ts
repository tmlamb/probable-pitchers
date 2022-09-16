// src/pages/api/trpc/[trpc].ts
import { appRouter, createContext } from "@probable/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
