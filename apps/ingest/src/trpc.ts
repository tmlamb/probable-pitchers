import { AppRouter } from "@probable/api";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import fetch from "node-fetch";
import superjson from "superjson";

// Allows trpc to use node-fetch
global.fetch = fetch as any;

const API_URL = process.env.API_URL || "http://localhost:3000/api/trpc";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: API_URL,
    }),
  ],
  transformer: superjson,
});
