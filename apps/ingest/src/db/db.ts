import { add, endOfToday, format } from "date-fns";
import prisma from "./client.js";
import { Pitcher, Team, Game } from "@probable/db";

export const client = {
  team: {
    byId: (id: number) => {
      return prisma.team.findUnique({ where: { id } });
    },
    upsert: ({ id, name, abbreviation }: Team) => {
      console.info(`Upserting team ${id} ${name} ${abbreviation}`);
      return prisma.team.upsert({
        where: { id },
        create: { id, name, abbreviation },
        update: { name, abbreviation },
      });
    },
  },
  pitcher: {
    byName: (name: string) => {
      return prisma.pitcher.findMany({ where: { name } });
    },
    byId: (id: number) => {
      return prisma.pitcher.findUnique({ where: { id } });
    },
    upsert: ({ id, name, teamId, primaryNumber }: Pitcher) => {
      return prisma.pitcher.upsert({
        where: { id },
        create: { id, name, primaryNumber, teamId },
        update: { name, primaryNumber, teamId },
      });
    },
  },
  game: {
    byId: (id: number) => {
      return prisma.game.findUnique({ where: { id } });
    },
    today: () => {
      const start = new Date();
      const end = add(endOfToday(), { hours: 6 });
      console.info(`Looking for games between ${start} and ${end}`);
      return prisma.game.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        include: {
          awayPitcher: true,
          homePitcher: true,
        },
      });
    },
    upsert: ({ id, date, homePitcherId, awayPitcherId }: Game) => {
      return prisma.game.upsert({
        where: { id },
        create: { id, date, homePitcherId, awayPitcherId },
        update: { date, homePitcherId, awayPitcherId },
      });
    },
  },
  subscription: {
    byPitcherId: (pitcherId: number) => {
      return prisma.subscription.findMany({
        where: { pitcherId },
        include: { user: { include: { devices: true } } },
      });
    },
  },
  user: {
    byId: (id: string) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
  notification: {
    create: ({
      deviceId,
      gameId,
      pitcherId,
    }: {
      deviceId: string;
      gameId: number;
      pitcherId: number;
    }) => {
      return prisma.notification.create({
        data: { deviceId, gameId, pitcherId },
      });
    },
    update: (id: number, sentOn: Date) => {
      return prisma.notification.update({
        where: { id },
        data: { sentOn },
      });
    },
  },
  device: {
    byUserId: (userId: string) => {
      return prisma.device.findMany({
        where: { userId },
      });
    },
    withPendingNotifications: () => {
      const start = new Date();
      const hour = Number(format(start, "H"));
      const end = add(hour < 6 ? start : endOfToday(), { hours: 6 });

      console.info(
        `Querying devices with unsent notifications between ${start} and ${end}`
      );

      const notificationsPendingToday = {
        AND: [
          {
            sentOn: null,
          },
          {
            game: {
              date: {
                gte: start,
                lte: end,
              },
            },
          },
        ],
      };

      return prisma.device.findMany({
        select: {
          id: true,
          notifications: {
            include: {
              game: true,
              pitcher: true,
            },
            // limits the notifications to those that are pending today
            where: notificationsPendingToday,
          },
          timezone: true,
          pushToken: true,
        },
        where: {
          notificationsEnabled: true,
          notifications: {
            // limits the devices to those that have notifications pending today
            some: notificationsPendingToday,
          },
        },
      });
    },
  },
};
