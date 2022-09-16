import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Probable Pitchers</title>
        <meta
          name="description"
          content="Get notified when you're favorite pitchers are scheduled to pitch."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Probable Pitchers
        </h1>
      </main>
    </>
  );
};

export default Home;
