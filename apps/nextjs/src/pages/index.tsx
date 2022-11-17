import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="container flex flex-col items-start justify-center min-h-screen p-4 mx-auto">
      <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
        Probable Pitcher
      </h1>
      <p>
        Have you ever wished you could track when your favorite players are
        scheduled to pitch? Probable Pitcher tracks the schedule for you and
        sends notifications to your phone so that you never miss a game.
      </p>
    </main>
  );
};

export default Home;
