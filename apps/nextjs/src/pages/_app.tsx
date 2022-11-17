// src/pages/_app.tsx
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  return (
    <>
      <Head>
        <title>Probable Pitcher</title>
        <meta
          name="description"
          content="Get notified when your favorite pitchers are scheduled to pitch."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
