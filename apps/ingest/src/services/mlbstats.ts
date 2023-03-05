import fetch from "node-fetch";
import { z } from "zod";

const Team = z.object({
  id: z.number(),
  name: z.string(),
});

export type MlbTeam = z.infer<typeof Team>;

const ProbablePitcher = z.object({
  id: z.number(),
  fullName: z.string(),
});

const Player = ProbablePitcher.merge(
  z.object({
    currentTeam: z.object({
      id: z.number(),
    }),
    primaryPosition: z.object({
      code: z.string(),
    }),
  })
);

export type MlbPlayer = z.infer<typeof Player>;

const TeamPitcher = z.object({
  team: Team,
  probablePitcher: ProbablePitcher.optional(),
});

const Game = z.object({
  gamePk: z.number(),
  gameDate: z.string(),
  teams: z.object({
    away: TeamPitcher,
    home: TeamPitcher,
  }),
});

export type MlbGame = z.infer<typeof Game>;

const ScheduleResponse = z.object({
  dates: z.array(
    z.object({
      date: z.string(),
      games: z.array(Game),
    })
  ),
});

export async function getGames(date: string): Promise<MlbGame[]> {
  console.log("Fetching games for date: ", date);
  return fetch(
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=team,probablePitcher`
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

const TeamsResponse = z.object({
  teams: z.array(Team),
});

export async function getTeams(season: string): Promise<MlbTeam[]> {
  console.log("Season:",season);
  return fetch(
    `https://statsapi.mlb.com/api/v1/teams?sportId=1&season=${season}`
  )
    .then((res) => res.json())
    .then((data) => {
      const teams = TeamsResponse.parse(data);
      return teams.teams;
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}

const PlayersResponse = z.object({
  people: z.array(Player),
});

export async function getPitchers(season: string): Promise<MlbPlayer[]> {
  return fetch(
    `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`
  )
    .then((res) => res.json())
    .then((data) => {
      const players = PlayersResponse.parse(data);
      // "1" is a pitcher
      // "Y" is a two-way player (stupid sexy Ohtani)
      return players.people.filter(
        (p) => p.primaryPosition.code === "1" || p.primaryPosition.code === "Y"
      );
    })
    .catch((err: Error) => {
      console.error("Error fetching players:", err);
      throw err;
    });
}
