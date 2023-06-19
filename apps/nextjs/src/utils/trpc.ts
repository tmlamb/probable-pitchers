// src/utils/trpc.ts
import type { AppRouter } from "@probable/api";
import { transformer } from "@probable/api/transformer";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  //if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  //return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
  return `http://localhost:3000`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer,
    };
  },
  ssr: false,
});
