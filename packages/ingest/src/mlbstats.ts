import fetch from "node-fetch";
import { z } from "zod";

const TeamPitcher = z.object({
  team: z.object({
    id: z.number(),
    name: z.string(),
  }),
  probablePitcher: z
    .object({
      id: z.number(),
      fullName: z.string(),
    })
    .optional(),
});

const Game = z.object({
  gamePk: z.number(),
  gameDate: z.string(),
  teams: z.object({
    away: TeamPitcher,
    home: TeamPitcher,
  }),
});

const ScheduleResponse = z.object({
  dates: z.array(
    z.object({
      date: z.string(),
      games: z.array(Game),
    })
  ),
});

export async function getGames(date: string): Promise<z.infer<typeof Game>[]> {
  return fetch(
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&language=en&hydrate=team(league),probablePitcher`
  )
    .then((res) => res.json())
    .then((data) => {
      const schedule = ScheduleResponse.parse(data);
      return schedule.dates
        .filter((d) => d.date === date)
        .reduce((acc, cur) => {
          return acc.concat(cur.games);
        }, [] as z.infer<typeof Game>[]);
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}
