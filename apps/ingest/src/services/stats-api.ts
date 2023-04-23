import fetch from "node-fetch";
import { z } from "zod";

const team = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

export type Team = z.infer<typeof team>;

const probablePitcher = z.object({
  id: z.number(),
  fullName: z.string(),
  primaryNumber: z.string().optional(),
});

const player = probablePitcher.merge(
  z.object({
    currentTeam: z.object({
      id: z.number(),
    }),
    primaryPosition: z.object({
      code: z.string(),
    }).optional(),
  })
);

export type Player = z.infer<typeof player>;

const teamPitcher = z.object({
  team,
  probablePitcher: probablePitcher.optional(),
});

const game = z.object({
  gamePk: z.number(),
  gameDate: z.string(),
  teams: z.object({
    away: teamPitcher,
    home: teamPitcher,
  }),
});

export type Game = z.infer<typeof game>;

const scheduleResponse = z.object({
  dates: z.array(
    z.object({
      date: z.string(),
      games: z.array(game),
    })
  ),
});

export async function getGames(date: string): Promise<Game[]> {
  console.log("Fetching games for date: ", date);
  return fetch(
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=team,probablePitcher`
  )
    .then((res) => res.json())
    .then((data) => {
      const schedule = scheduleResponse.parse(data);
      return schedule.dates
        .filter((d) => d.date === date)
        .reduce((acc, cur) => {
          return acc.concat(cur.games);
        }, [] as z.infer<typeof game>[]);
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}

const teamsResponse = z.object({
  teams: z.array(team),
});

export async function getTeams(season: string): Promise<Team[]> {
  console.log("Season:",season);
  return fetch(
    `https://statsapi.mlb.com/api/v1/teams?sportId=1&season=${season}`
  )
    .then((res) => res.json())
    .then((data) => {
      const teams = teamsResponse.parse(data);
      return teams.teams;
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}

const playersResponse = z.object({
  people: z.array(player),
});

export async function getPitchers(season: string): Promise<Player[]> {
  return fetch(
    `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`
  )
    .then((res) => res.json())
    .then((data) => {
      const players = playersResponse.parse(data);
      // "1" is a pitcher
      // "Y" is a two-way player (stupid sexy Ohtani)
      return players.people.filter(
        (p) => p.primaryPosition?.code === "1" || p.primaryPosition?.code === "Y"
      );
    })
    .catch((err: Error) => {
      console.error("Error fetching players:", err);
      throw err;
    });
}
