import { Pitcher } from "@prisma/client";
import pkg from "date-fns-tz";
import { client } from "../db/db.js";
import { sendPushNotification } from "../services/push.js";
const { formatInTimeZone } = pkg;

const TIME_FORMAT = "h:mm aaa";

export async function ingestNotifications() {
  const gamesToday = await client.game.today();

  for (const game of gamesToday) {
    const pitchers = [game.homePitcher, game.awayPitcher].filter(
      (pitcher) => !!pitcher
    ) as Pitcher[];

    for (const pitcher of pitchers) {
      const subscriptions = await client.subscription.byPitcherId(pitcher.id);
      for (const subscription of subscriptions) {
        const existingNotification = await client.notification.byRelations(
          subscription.id,
          game.id
        );

        if (!existingNotification) {
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

      const fulfilled = new Set<number>();
      for (const device of user.devices) {
        let message = "Pitching Today:\n";
        for (const notification of notifications) {
          const localizedGameTime = formatInTimeZone(
            notification.game.date,
            device.timezone,
            TIME_FORMAT
          );

          message += `${notification.subscription.pitcher.name} - ${localizedGameTime}\n`;
          fulfilled.add(notification.id);
        }
        sendPushNotification(
          device.pushToken,
          "Probable Pitcher Alert",
          message
        );
      }
      for (const id of fulfilled) {
        await client.notification.complete(id, new Date());
      }
    } catch (e) {
      console.error("Error processing notifications for user: ", user, e);
      continue;
    }
  }
}
