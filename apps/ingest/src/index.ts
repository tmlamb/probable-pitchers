// import { processGames } from "./jobs/daily-games.js";
import { ingestGames } from "./jobs/games.js";
import {
  ingestNotifications,
  sendNotifications,
} from "./jobs/notifications.js";
import { ingestPitchers } from "./jobs/pitchers.js";
import { ingestTeams } from "./jobs/teams.js";

const jobConfig = process.env.INGEST_JOBS;

if (jobConfig) {
  if (jobConfig.includes("teams")) {
    await ingestTeams();
  }

  if (jobConfig.includes("pitchers")) {
    await ingestPitchers();
  }

  if (jobConfig.includes("games")) {
    await ingestGames();
  }

  if (jobConfig.includes("notifications")) {
    await ingestNotifications();
    await sendNotifications();
  }
}
