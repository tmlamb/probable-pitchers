import type { NextPage } from "next";
import Head from "next/head";

const Privacy: NextPage = () => {
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
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="text-5xl md:text-[2rem] leading-normal font-extrabold text-gray-700">
          Privacy Policy
        </h1>
        <p>
          Probable Pitcher does not collect any personal information. If despite
          this, any of your personal information were to be obtained by the app,
          we would not sell or give it to anyone.
        </p>
      </main>
    </>
  );
};

export default Privacy;
