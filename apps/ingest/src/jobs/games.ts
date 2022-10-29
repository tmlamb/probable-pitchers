import { add } from "date-fns";
import formatISO from "date-fns/formatISO/index.js";
import { client } from "../db.js";
import { getGames } from "../services/mlbstats.js";
import { processPitcher } from "./pitchers.js";

export async function processGames() {
  const [today, tomorrow, dayAfter] = await Promise.all([
    getGames(formatISO(new Date(), { representation: "date" })),

    getGames(
      formatISO(add(new Date(), { days: 1 }), { representation: "date" })
    ),
    getGames(
      formatISO(add(new Date(), { days: 2 }), { representation: "date" })
    ),
  ]);

  for (const game of [...today, ...tomorrow, ...dayAfter]) {
    console.log("Processing Game: ", game);

    [game.teams.away, game.teams.home].forEach(async (team) => {
      if (team.probablePitcher) {
        processPitcher({
          fullName: team.probablePitcher.fullName,
          id: team.probablePitcher.id,
          currentTeam: {
            id: team.team.id,
          },
        });
      }
    });

    await client.game.upsert(
      game.gamePk,
      new Date(game.gameDate),
      game.teams.home.probablePitcher?.id,
      game.teams.away.probablePitcher?.id
    );
  }
}
