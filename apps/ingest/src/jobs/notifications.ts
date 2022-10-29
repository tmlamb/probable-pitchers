import { Game, Pitcher, Subscription } from "@prisma/client";
import pkg from "date-fns-tz";
import { client } from "../db.js";
import { sendPushNotification } from "../services/push.js";
const { formatInTimeZone } = pkg;

const TIME_FORMAT = "hh:mm aaa";

export async function processNotifications() {
  const gamesToday = await client.game.today();

  const userNotifications: {
    [key: string]: {
      pitcher: Pitcher;
      subscription: Subscription;
      game: Game;
    }[];
  } = {};

  for (const game of gamesToday) {
    console.log("Processing Game for Notifications: ", game);
    [game.awayPitcherId, game.homePitcherId].forEach(async (pitcherId) => {
      console.log("Processing Pitcher for Notifications: ", pitcherId);
      if (pitcherId) {
        const subscriptions = await client.subscription.byPitcherId(pitcherId);
        for (const subscription of subscriptions) {
          console.log(
            "Processing Subscription for Notifications: ",
            subscription
          );
          const existingNotification =
            await client.notification.bySubscriptionAndGame(
              subscription.id,
              game.id
            );
          console.log("Existing Notification: ", existingNotification);

          if (!existingNotification) {
            const user = await client.user.byId(subscription.userId);
            console.log("User for subscription: ", user);
            if (user?.notificationsEnabled) {
              const pitcher = await client.pitcher.byId(pitcherId);
              console.log("Pitcher for subscription: ", pitcher);
              if (pitcher) {
                if (!(user.id in userNotifications)) {
                  console.log("Adding user to notifications: ", user.id);
                  userNotifications[user.id] = [];
                }
                console.log("Adding notification for user: ", {
                  pitcher,
                  subscription,
                  game,
                });
                userNotifications[user.id]?.push({
                  pitcher,
                  subscription,
                  game,
                });
              } else {
                console.warn("No pitcher found for id: ", pitcherId);
              }
            }
          }
        }
      }
    });
  }

  for (const [userId, notifications] of Object.entries(userNotifications)) {
    console.log("Sending notifications for user: ", userId);
    console.log("Notifications: ", notifications);
    const devices = await client.device.byUserId(userId);
    for (const device of devices) {
      console.log("Sending notifications to device: ", device);
      if (notifications.length === 1 && notifications[0]) {
        const localizedGameTime = formatInTimeZone(
          notifications[0].game.date,
          device.timezone,
          TIME_FORMAT
        );

        sendPushNotification(
          device.pushToken,
          "Probable Pitcher Alert",
          `${notifications[0].pitcher.name} is pitching today at ${localizedGameTime}`
        );
      } else {
        let message = "Some of your favorite players are pitching today:\n";
        for (const notification of notifications) {
          const localizedGameTime = formatInTimeZone(
            notification.game.date,
            device.timezone,
            TIME_FORMAT
          );
          message += `${notification.pitcher.name} at ${localizedGameTime}\n`;
        }
        sendPushNotification(
          device.pushToken,
          "Probable Pitcher Alert",
          message
        );
      }
    }
  }
}
