import { format, formatISO } from "date-fns";
import { Game, getGames } from "../services/mlbstats.js";
import { sendPushNotification } from "../services/notifications.js";
import { client } from "../trpc.js";

async function processGame(game: Game) {
  [game.teams.away, game.teams.home].forEach(async (team) => {
    const existingTeam = await client.team.byId.query(team.team.id);
    if (!existingTeam && !newTeamIds.includes(team.team.id)) {
      newTeamIds.push(team.team.id);
      await client.team.create.mutate({
        id: team.team.id,
        name: team.team.name,
      });
    } else if (existingTeam && existingTeam.name !== team.team.name) {
      await client.team.update.mutate({
        id: team.team.id,
        name: team.team.name,
      });
    }

    if (team.probablePitcher) {
      const existingPitcher = await client.pitcher.byId.query(
        team.probablePitcher.id
      );
      if (!existingPitcher) {
        await client.pitcher.create.mutate({
          id: team.probablePitcher.id,
          name: team.probablePitcher.fullName,
          teamId: team.team.id,
        });
      } else if (
        existingPitcher.name !== team.probablePitcher.fullName ||
        existingPitcher.teamId !== team.team.id
      ) {
        await client.pitcher.update.mutate({
          id: team.probablePitcher.id,
          name: team.probablePitcher.fullName,
          teamId: team.team.id,
        });
      }
    }
  });

  const existingGame = await client.game.byId.query(game.gamePk);
  if (!existingGame) {
    await client.game.create.mutate({
      id: game.gamePk,
      date: new Date(game.gameDate),
      homePitcherId: game.teams.home.probablePitcher?.id,
      awayPitcherId: game.teams.away.probablePitcher?.id,
    });

    [
      game.teams.home.probablePitcher?.id,
      game.teams.away.probablePitcher?.id,
    ].forEach(async (pitcherId) => {
      if (pitcherId) {
        const subscriptions = await client.subscription.byPitcherId.query(
          pitcherId
        );
        subscriptions.forEach(async (subscription) => {
          const user = await client.user.byId.query(subscription.userId);
          const pitcher = await client.pitcher.byId.query(pitcherId);
          if (user?.pushToken && pitcher) {
            sendPushNotification(
              user.pushToken,
              "Probable Pitcher Alert",
              `${pitcher.name} is pitching today at ${format(
                new Date(game.gameDate),
                "h:m aaa"
              )}!`
            );
          }
        });
      }
    });
  }
}

const games = await getGames(formatISO(new Date(), { representation: "date" }));

const newTeamIds: number[] = [];

for (const game of games) {
  await processGame(game);
}
