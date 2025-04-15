import { add } from "date-fns";
import formatISO from "date-fns/formatISO/index.js";
import { client } from "../db/db.js";
import { getGames } from "../services/stats-api.js";
import { processPitcher } from "./pitchers.js";

export async function ingestGames() {
  const today = new Date();
  const schedule = await Promise.all([
    getGames(formatISO(today, { representation: "date" })),
    getGames(formatISO(add(today, { days: 1 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 2 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 3 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 4 }), { representation: "date" })),
  ]);

  console.debug(
    `Found ${schedule.flat().length} games for ${today.toISOString()}: ${JSON.stringify(schedule.flat())}`
  );

  for (const game of schedule.flat()) {
    for (const team of [game.teams.away, game.teams.home]) {
      if (team.probablePitcher) {
        await processPitcher({
          fullName: team.probablePitcher.fullName,
          id: team.probablePitcher.id,
          currentTeam: {
            id: team.team.id,
          },
        });
      }
    }
    await client.game.upsert({
      id: game.gamePk,
      date: new Date(game.gameDate),
      homePitcherId: game.teams.home.probablePitcher?.id || null,
      awayPitcherId: game.teams.away.probablePitcher?.id || null,
    });
  }
}
