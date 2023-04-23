import { format } from "date-fns";
import { client } from "../db/db.js";
import { getTeams } from "../services/stats-api.js";

export async function ingestTeams() {
  const season = format(new Date(), "yyyy");

  const teams = await getTeams(season);
  console.debug("Found teams: ", teams);

  for (const team of teams) {
    const existing = await client.team.byId(team.id);
    if (
      !existing ||
      existing.name !== team.name ||
      (team.abbreviation && existing.abbreviation !== team.abbreviation)
    ) {
      await client.team.upsert({
        id: team.id,
        name: team.name,
        abbreviation: team.abbreviation || null
      });
    }
  }
}
