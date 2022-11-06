import { add, endOfToday } from "date-fns";
import prisma from "./client.js";

export const client = {
  team: {
    byId: (id: number) => {
      return prisma.team.findUnique({ where: { id } });
    },
    upsert: (id: number, name: string) => {
      return prisma.team.upsert({
        where: { id },
        create: { id, name },
        update: { name },
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
    upsert: (id: number, name: string, teamId: number) => {
      return prisma.pitcher.upsert({
        where: { id },
        create: { id, name, teamId },
        update: { name, teamId },
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
    upsert: (
      id: number,
      date: Date,
      homePitcherId?: number,
      awayPitcherId?: number
    ) => {
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
      });
    },
  },
  user: {
    byId: (id: string) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
    withUnsentNotificationsForFutureGames: () => {
      const start = new Date();
      const end = add(endOfToday(), { hours: 6 });
      console.info(
        `Looking for users with unsent notifications between ${start} and ${end}`
      );
      const notifyCondition = {
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
      return prisma.user.findMany({
        select: {
          id: true,
          notifications: {
            include: {
              game: true,
              pitcher: true,
            },
            where: notifyCondition,
          },
          devices: true,
        },
        where: {
          notificationsEnabled: true,
          notifications: {
            some: notifyCondition,
          },
        },
      });
    },
  },
  notification: {
    create: (userId: string, gameId: number, pitcherId: number) => {
      return prisma.notification.create({
        data: { userId, gameId, pitcherId },
      });
    },
    complete: (id: number, sentOn: Date) => {
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
  },
};
