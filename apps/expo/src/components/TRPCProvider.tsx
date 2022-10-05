import type { AppRouter } from "@probable/api";
import { transformer } from "@probable/api/transformer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react";
import { useState } from "react";
import { getBaseUrl } from "../api";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    const url = getBaseUrl() + "/api/trpc";
    return trpc.createClient({ links: [httpBatchLink({ url })], transformer });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCProvider;
