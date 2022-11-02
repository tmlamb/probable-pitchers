import { format } from "date-fns";
import { client } from "../db/db.js";
import { getPitchers } from "../services/mlbstats.js";

export async function processPitcher(pitcher: {
  fullName: string;
  currentTeam: { id: number };
  id: number;
}) {
  const existingPitcher = await client.pitcher.byId(pitcher.id);
  if (
    !existingPitcher ||
    existingPitcher.name !== pitcher.fullName ||
    existingPitcher.teamId !== pitcher.currentTeam.id
  ) {
    await client.pitcher.upsert(
      pitcher.id,
      pitcher.fullName,
      pitcher.currentTeam.id
    );

    const pitchersWithName = await client.pitcher.byName(pitcher.fullName);
    if (pitchersWithName.length > 1) {
      console.warn(
        `Potential Duplicate Pitcher: ${pitcher.fullName} has multiple IDs: ${pitchersWithName}`
      );
    }
  }
}

export async function ingestPitchers() {
  const season = format(new Date(), "yyyy");

  const pitchers = await getPitchers(season);
  for (const pitcher of pitchers) {
    processPitcher(pitcher);
  }
}
