import { Pitcher, Prisma } from "@prisma/client";
import pkg from "date-fns-tz";
import { client } from "../db/db.js";
import { sendPushNotification } from "../services/push.js";
const { formatInTimeZone } = pkg;

const TIME_FORMAT = "h:mm aaa";

export async function ingestNotifications() {
  const gamesToday = await client.game.today();
  console.debug("Found games today:", JSON.stringify(gamesToday));
  for (const game of gamesToday) {
    const pitchers = [game.homePitcher, game.awayPitcher].filter(
      (pitcher) => !!pitcher
    ) as Pitcher[];

    for (const pitcher of pitchers) {
      const subscriptions = await client.subscription.byPitcherId(pitcher.id);
      for (const subscription of subscriptions) {
        try {
          await client.notification.create({
            userId: subscription.userId,
            gameId: game.id,
            pitcherId: pitcher.id
          });
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002" // unique constraint violation, notification already ingested
          ) {
            console.info("Duplicate notifications cannot be created: ", e);
          } else {
            console.error(
              "Unknown error ingesting notifications for subscription: ",
              e
            );
          }
          continue;
        }
      }
    }
  }
}

export async function sendNotifications() {
  const usersWithNotifications =
    await client.user.withUnsentNotificationsForFutureGames();
  console.debug(
    `Found ${usersWithNotifications.length
    } users with notifications: ${JSON.stringify(usersWithNotifications)}`
  );
  for (const user of usersWithNotifications) {
    try {
      console.debug(
        `User ${user.id} has ${user.notifications.length
        } notifications: ${JSON.stringify(user.notifications)}`
      );

      const fulfilled = new Set<number>();
      for (const device of user.devices) {
        const localHour = Number(formatInTimeZone(Date.now(), device.timezone, "H"));
        if (localHour < 9 || localHour >= 21) {
          console.debug(
            `User ${user.id} / device ${device.id} skipped alert because ${localHour} is in quiet hours for the timezone '${device.timezone}'.`
          );
          continue;
        }
        console.debug(
          `User ${user.id} / device ${device.id} sent alert because ${localHour} is in working hours for the timezone '${device.timezone}'.`
        );

        let messages: string[] = [];
        for (const notification of user.notifications) {
          const localizedGameTime = formatInTimeZone(
            notification.game.date,
            device.timezone,
            TIME_FORMAT
          );

          messages.push(`${notification.pitcher.name} - ${localizedGameTime}`);
          fulfilled.add(notification.id);
        }
        sendPushNotification(
          device.pushToken,
          `Probable Pitcher${messages.length > 1 ? "s" : ""} Today`,
          messages.join("\n")
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
