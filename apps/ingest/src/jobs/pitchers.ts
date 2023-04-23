import { format } from "date-fns";
import { client } from "../db/db.js";
import { getPitchers, Player } from "../services/stats-api.js";

export async function processPitcher(pitcher: Player) {
  const existing = await client.pitcher.byId(pitcher.id);
  if (
    !existing ||
    existing.name !== pitcher.fullName ||
    (pitcher.currentTeam && existing.teamId !== pitcher.currentTeam.id) ||
    (pitcher.primaryNumber && existing.primaryNumber !== pitcher.primaryNumber)
  ) {
    console.debug("Upserting pitcher: ", pitcher);
    await client.pitcher.upsert({
      id: pitcher.id,
      name: pitcher.fullName,
      teamId: pitcher.currentTeam.id,
      primaryNumber: pitcher.primaryNumber || null,
    });

    const pitchersWithName = await client.pitcher.byName(pitcher.fullName);
    if (pitchersWithName.length > 1) {
      console.warn(
        `Potential Duplicate Pitcher: ${
          pitcher.fullName
        } has multiple IDs: ${JSON.stringify(pitchersWithName)}`
      );
    }
  }
}

export async function ingestPitchers() {
  const season = format(new Date(), "yyyy");

  const pitchers = await getPitchers(season);
  console.debug("Found pitchers: ", pitchers);
  for (const pitcher of pitchers) {
    await processPitcher(pitcher);
  }
}
