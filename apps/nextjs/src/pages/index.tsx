import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Probable Pitcher</title>
        <meta
          name="description"
          content="Get notified when your favorite pitchers are scheduled to pitch."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
            Probable Pitcher
          </h1>
        </main>
      </Layout>
    </>
  );
};

export default Home;
