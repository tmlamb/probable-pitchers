import { processGames } from "./jobs/daily-games.js";
import { processSeason } from "./jobs/seed-teams-players.js";

const jobConfig = process.env.INGEST_JOBS;

if (jobConfig && jobConfig?.includes("seed-season")) {
  await processSeason();
}

if (jobConfig && jobConfig.includes("daily-games")) {
  await processGames();
}
