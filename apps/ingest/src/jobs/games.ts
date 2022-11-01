import { add } from "date-fns";
import formatISO from "date-fns/formatISO/index.js";
import { client } from "../db/db.js";
import { getGames } from "../services/mlbstats.js";
import { processPitcher } from "./pitchers.js";

export async function processGames() {
  const today = new Date();
  const schedule = await Promise.all([
    getGames(formatISO(today, { representation: "date" })),
    getGames(formatISO(add(today, { days: 1 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 2 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 3 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 4 }), { representation: "date" })),
  ]);

  for (const game of schedule.flat()) {
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
    client.game.upsert(
      game.gamePk,
      new Date(game.gameDate),
      game.teams.home.probablePitcher?.id,
      game.teams.away.probablePitcher?.id
    );
  }
}
