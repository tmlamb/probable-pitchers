import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";

export const prisma = new PrismaClient({
  log: ["query"],
});

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
        update: { id, name, teamId },
      });
    },
  },
  game: {
    byId: (id: number) => {
      return prisma.game.findUnique({ where: { id } });
    },
    today: () => {
      return prisma.game.findMany({
        where: {
          date: {
            gte: new Date(),
            lte: add(new Date(), { days: 1 }),
          },
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
        update: { id, date, homePitcherId, awayPitcherId },
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
  },
  notification: {
    bySubscriptionAndGame: (subscriptionId: number, gameId: number) => {
      return prisma.notification.findUnique({
        where: { subscriptionId_gameId: { subscriptionId, gameId } },
      });
    },
    create: (subscriptionId: number, gameId: number) => {
      return prisma.notification.create({
        data: { subscriptionId, gameId, sentOn: new Date() },
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
