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
    console.info("----------INGESTING TEAMS START----------");
    await ingestTeams();
    console.info("----------INGESTING TEAMS END----------");
  }

  if (jobConfig.includes("pitchers")) {
    console.info("----------INGESTING PITCHERS START----------");
    await ingestPitchers();
    console.info("----------INGESTING PITCHERS END----------");
  }

  if (jobConfig.includes("games")) {
    console.info("----------INGESTING GAMES START----------");
    await ingestGames();
    console.info("----------INGESTING GAMES END----------");
  }

  if (jobConfig.includes("notifications")) {
    console.info("----------INGESTING NOTIFICATIONS START----------");
    await ingestNotifications();
    console.info("----------INGESTING NOTIFICATIONS END----------");
    console.info("----------SENDING NOTIFICATIONS START----------");
    await sendNotifications();
    console.info("----------SENDING NOTIFICATIONS END----------");
  }
}
