import pkg from "date-fns-tz";
import formatISO from "date-fns/formatISO/index.js";
import { client } from "../db.js";
import { Game, getGames } from "../services/mlbstats.js";
import { sendPushNotification } from "../services/notifications.js";
const { formatInTimeZone } = pkg;

async function processGame(game: Game) {
  console.log("Processing Game: ", game);
  const newTeamIds: number[] = [];
  [game.teams.away, game.teams.home].forEach(async (team) => {
    const existingTeam = await client.team.byId(team.team.id);
    if (!existingTeam && !newTeamIds.includes(team.team.id)) {
      newTeamIds.push(team.team.id);
      await client.team.create(team.team.id, team.team.name);
    } else if (existingTeam && existingTeam.name !== team.team.name) {
      await client.team.update(team.team.id, team.team.name);
    }

    if (team.probablePitcher) {
      const existingPitcher = await client.pitcher.byId(
        team.probablePitcher.id
      );
      if (!existingPitcher) {
        await client.pitcher.create(
          team.probablePitcher.id,
          team.probablePitcher.fullName,
          team.team.id
        );
      } else if (
        existingPitcher.name !== team.probablePitcher.fullName ||
        existingPitcher.teamId !== team.team.id
      ) {
        await client.pitcher.update(
          team.probablePitcher.id,
          team.probablePitcher.fullName,
          team.team.id
        );
      }
    }
  });

  const existingGame = await client.game.byId(game.gamePk);
  if (!existingGame) {
    console.log(`Game ${game.gamePk} does not exist, so inserting`);
    await client.game.create(
      game.gamePk,
      new Date(game.gameDate),
      game.teams.home.probablePitcher?.id,
      game.teams.away.probablePitcher?.id
    );

    [
      game.teams.home.probablePitcher?.id,
      game.teams.away.probablePitcher?.id,
    ].forEach(async (pitcherId) => {
      console.log(`Processing ${pitcherId} of game ${game.gamePk}`);
      if (pitcherId) {
        const subscriptions = await client.subscription.byPitcherId(pitcherId);
        console.log(
          `Pitcher ${pitcherId} has subscriptions: ${JSON.stringify(
            subscriptions
          )}`
        );
        subscriptions.forEach(async (subscription) => {
          const user = await client.user.byId(subscription.userId);
          const pitcher = await client.pitcher.byId(pitcherId);
          console.log(
            `Processing subscription ${subscription.id} for user ${user?.id} and pitcher ${pitcher?.id}`
          );
          if (pitcher) {
            user?.devices.forEach((device) => {
              console.log(
                `Process device ${device.id} with push token ${device.pushToken} and tz ${device.timezone} for user ${user.id}`
              );

              const localizedGameTime = formatInTimeZone(
                new Date(game.gameDate),
                device.timezone,
                "hh:mm aaa"
              );

              sendPushNotification(
                device.pushToken,
                "Probable Pitcher Alert",
                `${pitcher.name} is pitching today at ${localizedGameTime}`
              );
            });
          }
        });
      }
    });
  }
}

export async function processGames() {
  const games = await getGames(
    formatISO(new Date(), { representation: "date" })
  );
  console.log("Games today: ", games);

  for (const game of games) {
    await processGame(game);
  }
}
