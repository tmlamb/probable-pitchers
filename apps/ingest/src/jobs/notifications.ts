import { Pitcher, Prisma } from "@prisma/client";
import pkg from "date-fns-tz";
import { client } from "../db/db.js";
import { sendPushNotification } from "../services/push.js";
const { formatInTimeZone } = pkg;

const TIME_FORMAT = "h:mm aaa z";

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
        for (const device of subscription.user.devices) {
          try {
            await client.notification.create({
              deviceId: device.id,
              gameId: game.id,
              pitcherId: pitcher.id,
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
}

export async function sendNotifications() {
  const devicesWithNotifications =
    await client.device.withPendingNotifications();

  console.debug(
    `Found ${
      devicesWithNotifications.length
    } devices with notifications: ${JSON.stringify(devicesWithNotifications)}`
  );

  for (const device of devicesWithNotifications) {
    const localHour = Number(
      formatInTimeZone(Date.now(), device.timezone, "H")
    );
    if (localHour < 9 || localHour >= 21) {
      console.debug(
        `User device ${device.id} skipped alert because ${localHour} is in quiet hours for the timezone '${device.timezone}'.`
      );
      continue;
    }
    console.debug(
      `User device ${device.id} sent alert because ${localHour} is in working hours for the timezone '${device.timezone}'.`
    );

    console.debug(
      `Device ${device.id} has ${
        device.notifications.length
      } notifications: ${JSON.stringify(device.notifications)}`
    );

    const fulfilled = new Set<number>();
    const messages: string[] = [];

    for (const notification of device.notifications) {
      const localizedGameTime = formatInTimeZone(
        notification.game.date,
        device.timezone,
        TIME_FORMAT
      );

      messages.push(`${notification.pitcher.name} @ ${localizedGameTime}`);
      fulfilled.add(notification.id);
    }

    try {
      sendPushNotification(
        device.pushToken,
        `Probable Pitcher${messages.length > 1 ? "s" : ""}`,
        messages.join("\n")
      );
    } catch (e) {
      console.error(
        `Error sending push notification to ${device.pushToken} for device: ${device}`,
        e
      );
      continue;
    }

    for (const id of fulfilled) {
      try {
        await client.notification.update(id, new Date());
      } catch (e) {
        console.error(
          `Error marking notification ${id} for device ${device.id} as completed`,
          e
        );
        continue;
      }
    }
  }
}
