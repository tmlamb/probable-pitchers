import { format } from "date-fns";
import { client } from "../db/db.js";
import { getTeams } from "../services/mlbstats.js";

export async function ingestTeams() {
  const season = format(new Date(), "yyyy");

  const teams = await getTeams(season);

  for (const team of teams) {
    const existingTeam = await client.team.byId(team.id);
    if (!existingTeam || existingTeam.name !== team.name) {
      await client.team.upsert(team.id, team.name);
    }
  }
}
