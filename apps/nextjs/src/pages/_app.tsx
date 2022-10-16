// src/pages/_app.tsx
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
