import { format } from "date-fns";
import { client } from "../db.js";
import { getPitchers, getTeams, Player, Team } from "../services/mlbstats.js";

async function processTeam(team: Team) {
  const existingTeam = await client.team.byId(team.id);
  if (!existingTeam) {
    await client.team.create(team.id, team.name);
  } else if (existingTeam && existingTeam.name !== team.name) {
    await client.team.update(team.id, team.name);
  }
}

async function processPitcher(pitcher: Player) {
  const existingPitcher = await client.pitcher.byId(pitcher.id);
  if (!existingPitcher) {
    await client.pitcher.create(
      pitcher.id,
      pitcher.fullName,
      pitcher.currentTeam.id
    );
  } else if (
    existingPitcher &&
    (existingPitcher.name !== pitcher.fullName ||
      existingPitcher.teamId !== pitcher.currentTeam.id)
  ) {
    await client.pitcher.update(
      pitcher.id,
      pitcher.fullName,
      pitcher.currentTeam.id
    );
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
