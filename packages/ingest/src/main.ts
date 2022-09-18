import { AppRouter } from "@probable/api";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import fetch from "node-fetch";
import superjson from "superjson";
import { getGames } from "./mlbstats.js";

global.fetch = fetch as any;

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
  transformer: superjson,
});

const games = await getGames("2022-09-18");

const newTeamIds: number[] = [];

games.forEach(async (game) => {
  [game.teams.away, game.teams.home].forEach(async (team) => {
    const existingTeam = await client.team.byId.query(team.team.id);
    if (!existingTeam && !newTeamIds.includes(team.team.id)) {
      newTeamIds.push(team.team.id);
      await client.team.create.mutate({
        id: team.team.id,
        name: team.team.name,
      });
    } else if (existingTeam && existingTeam.name !== team.team.name) {
      await client.team.update.mutate({
        id: team.team.id,
        name: team.team.name,
      });
    }

    if (team.probablePitcher) {
      const existingPitcher = await client.pitcher.byId.query(
        team.probablePitcher.id
      );
      if (!existingPitcher) {
        await client.pitcher.create.mutate({
          id: team.probablePitcher.id,
          name: team.probablePitcher.fullName,
          teamId: team.team.id,
        });
      } else if (
        existingPitcher.name !== team.probablePitcher.fullName ||
        existingPitcher.teamId !== team.team.id
      ) {
        await client.pitcher.update.mutate({
          id: team.probablePitcher.id,
          name: team.probablePitcher.fullName,
          teamId: team.team.id,
        });
      }
    }
  });

  const existingGame = await client.game.byId.query(game.gamePk);
  if (!existingGame) {
    await client.game.create.mutate({
      id: game.gamePk,
      date: new Date(game.gameDate),
      homePitcherId: game.teams.home.probablePitcher?.id,
      awayPitcherId: game.teams.away.probablePitcher?.id,
    });
  }
});
