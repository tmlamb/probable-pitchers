import { AppRouter } from "@probable/api";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import fetch from "node-fetch";
import superjson from "superjson";

// Allows trpc to use node-fetch
global.fetch = fetch as any;

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
  transformer: superjson,
});
