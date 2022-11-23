import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="container flex flex-col items-start justify-start min-h-screen p-8 mx-auto max-w-7xl">
      <h1 className="text-3xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
        Probable Pitcher
      </h1>
      <p className="max-w-prose">
        Have you ever wished it was easier to keep track of when your favorite
        players are scheduled to pitch? Probable Pitcher watches the schedule
        for you and sends notifications to your phone so that you never miss the
        games you want to see.
      </p>
    </main>
  );
};

export default Home;
