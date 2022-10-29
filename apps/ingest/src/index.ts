// import { processGames } from "./jobs/daily-games.js";
import { processGames } from "./jobs/games.js";
import { processNotifications } from "./jobs/notifications.js";
import { processPitchers } from "./jobs/pitchers.js";
import { processTeams } from "./jobs/teams.js";

const jobConfig = process.env.INGEST_JOBS;

if (jobConfig) {
  if (jobConfig.includes("teams")) {
    await processTeams();
  }

  if (jobConfig.includes("pitchers")) {
    await processPitchers();
  }

  if (jobConfig.includes("games")) {
    await processGames();
  }

  if (jobConfig.includes("notifications")) {
    await processNotifications();
  }
}
