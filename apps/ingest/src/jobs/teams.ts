import { format } from "date-fns";
import { client } from "../db.js";
import { getTeams } from "../services/mlbstats.js";

export async function processTeams() {
  const season = format(new Date(), "yyyy");

  const teams = await getTeams(season);
  console.log("Teams found: ", teams);

  for (const team of teams) {
    const existingTeam = await client.team.byId(team.id);
    if (!existingTeam || existingTeam.name !== team.name) {
      await client.team.upsert(team.id, team.name);
    }
  }
}
