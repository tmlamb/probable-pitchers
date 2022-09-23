import { format } from "date-fns";
import { getPitchers, getTeams, Player, Team } from "../services/mlbstats.js";
import { client } from "../trpc.js";

async function processTeam(team: Team) {
  const existingTeam = await client.team.byId.query(team.id);
  if (!existingTeam) {
    await client.team.create.mutate({
      id: team.id,
      name: team.name,
    });
  } else if (existingTeam && existingTeam.name !== team.name) {
    await client.team.update.mutate({
      id: team.id,
      name: team.name,
    });
  }
}

async function processPitcher(pitcher: Player) {
  const existingPitcher = await client.pitcher.byId.query(pitcher.id);
  if (!existingPitcher) {
    await client.pitcher.create.mutate({
      id: pitcher.id,
      name: pitcher.fullName,
      teamId: pitcher.currentTeam.id,
    });
  } else if (
    existingPitcher &&
    (existingPitcher.name !== pitcher.fullName ||
      existingPitcher.teamId !== pitcher.currentTeam.id)
  ) {
    await client.pitcher.update.mutate({
      id: pitcher.id,
      name: pitcher.fullName,
      teamId: pitcher.currentTeam.id,
    });
  }
}

export async function processSeason() {
  const season = format(new Date(), "yyyy");

  const teams = await getTeams(season);

  for (const team of teams) {
    await processTeam(team);
  }

  const pitchers = await getPitchers(season);

  for (const pitcher of pitchers) {
    await processPitcher(pitcher);
  }
}
