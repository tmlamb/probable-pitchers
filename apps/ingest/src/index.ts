import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { ingestGames } from "./jobs/games.js";
import {
  ingestNotifications,
  sendNotifications,
} from "./jobs/notifications.js";
import { ingestPitchers } from "./jobs/pitchers.js";
import { ingestTeams } from "./jobs/teams.js";

const ingestJobs = process.env.INGEST_JOBS;

console.info("Running INGEST_JOBS:", ingestJobs);

if (ingestJobs) {
  if (ingestJobs.includes("teams")) {
    console.info("----------INGESTING TEAMS START----------");
    await ingestTeams();
    console.info("----------INGESTING TEAMS END----------");
  }

  if (ingestJobs.includes("pitchers")) {
    console.info("----------INGESTING PITCHERS START----------");
    await ingestPitchers();
    console.info("----------INGESTING PITCHERS END----------");
  }

  if (ingestJobs.includes("games")) {
    console.info("----------INGESTING GAMES START----------");
    await ingestGames();
    console.info("----------INGESTING GAMES END----------");
  }

  if (ingestJobs.includes("notifications")) {
    console.info("----------INGESTING NOTIFICATIONS START----------");
    await ingestNotifications();
    console.info("----------INGESTING NOTIFICATIONS END----------");
    console.info("----------SENDING NOTIFICATIONS START----------");
    await sendNotifications();
    console.info("----------SENDING NOTIFICATIONS END----------");
  }
}
