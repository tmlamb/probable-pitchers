// import { prisma } from "@probable/db";
import { prisma } from "@probable/db";

export const client = {
  team: {
    byId: (id: number) => {
      return prisma.team.findUnique({ where: { id } });
    },
    create: (id: number, name: string) => {
      return prisma.team.create({ data: { id, name } });
    },
    update: (id: number, name: string) => {
      return prisma.team.update({
        where: { id },
        data: { id, name },
      });
    },
  },
  pitcher: {
    byId: (id: number) => {
      return prisma.pitcher.findUnique({ where: { id } });
    },
    create: (id: number, name: string, teamId: number) => {
      return prisma.pitcher.create({ data: { id, name, teamId } });
    },
    update: (id: number, name: string, teamId: number) => {
      return prisma.pitcher.update({
        where: { id },
        data: { id, name, teamId },
      });
    },
  },
  game: {
    byId: (id: number) => {
      return prisma.game.findUnique({ where: { id } });
    },
    create: (
      id: number,
      date: Date,
      homePitcherId?: number,
      awayPitcherId?: number
    ) => {
      return prisma.game.create({
        data: { id, date, homePitcherId, awayPitcherId },
      });
    },
  },
  subscription: {
    byPitcherId: (pitcherId: number) => {
      return prisma.subscription.findMany({
        where: { pitcherId, enabled: true },
      });
    },
  },
  user: {
    byId: (id: number) => {
      return prisma.user.findUnique({ where: { id } });
    },
  },
};
