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

const games = await getGames("2022-09-17");

const newTeamIds: number[] = [];

games.forEach(async (game) => {
  const homeTeam = await client.team.byId.query(game.teams.home.team.id);
  if (!homeTeam && newTeamIds.includes(game.teams.home.team.id)) {
    newTeamIds.push(game.teams.home.team.id);
    client.team.create.mutate({
      id: game.teams.home.team.id,
      name: game.teams.home.team.name,
    });
  }

  const awayTeam = await client.team.byId.query(game.teams.away.team.id);
  if (!awayTeam && newTeamIds.includes(game.teams.away.team.id)) {
    newTeamIds.push(game.teams.away.team.id);
    client.team.create.mutate({
      id: game.teams.away.team.id,
      name: game.teams.away.team.name,
    });
  }
});
