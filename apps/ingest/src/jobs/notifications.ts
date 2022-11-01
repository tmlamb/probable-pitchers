import { Pitcher } from "@prisma/client";
import pkg from "date-fns-tz";
import { client } from "../services/db.js";
import { sendPushNotification } from "../services/push.js";
const { formatInTimeZone } = pkg;

const TIME_FORMAT = "hh:mm aaa";

export async function processNotifications() {
  const gamesToday = await client.game.today();

  for (const game of gamesToday) {
    console.log("Processing Game: ", game);

    const pitchers = [game.awayPitcher, game.homePitcher].filter(
      (pitcher) => !!pitcher
    ) as Pitcher[];

    for (const pitcher of pitchers) {
      console.log("Processing Pitcher: ", pitcher);
      const subscriptions = await client.subscription.byPitcherId(pitcher.id);
      for (const subscription of subscriptions) {
        console.log("Processing Subscription: ", subscription);
        const existingNotification = await client.notification.byRelations(
          subscription.id,
          game.id
        );

        if (!existingNotification) {
          console.log("Creating Notification: ", subscription.id, game.id);
          await client.notification.create(subscription.id, game.id);
        }
      }
    }
  }
}

export async function sendNotifications() {
  const usersWithNotifications =
    await client.user.withUnsentNotificationsForFutureGames();

  for (const user of usersWithNotifications) {
    try {
      if (!user?.notificationsEnabled) {
        continue;
      }
      const notifications = user.subscriptions.flatMap(
        (subscription) => subscription.notifications
      );

      for (const device of user.devices) {
        let message = "Pitching Today:\n";
        const fulfilled: {
          id: number;
          subscriptionId: number;
          gameId: number;
        }[] = [];
        for (const notification of notifications) {
          const localizedGameTime = formatInTimeZone(
            notification.game.date,
            device.timezone,
            TIME_FORMAT
          );

          message += `${notification.subscription.pitcher.name} - ${localizedGameTime}\n`;
          fulfilled.push(notification);
        }
        sendPushNotification(
          device.pushToken,
          "Probable Pitcher Alert",
          message
        );
        for (const { id, subscriptionId, gameId } of fulfilled) {
          await client.notification.complete(id, new Date());
        }
      }
    } catch (e) {
      console.error("Error processing notifications for user: ", user, e);
      continue;
    }
  }
}
