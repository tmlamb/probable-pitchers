import { z } from "zod";
import { t } from "../trpc";

export const gameRouter = t.router({
  byId: t.procedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.game.findUnique({ where: { id: input } });
  }),
  create: t.procedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
        homePitcherId: z.number().optional(),
        awayPitcherId: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.game.create({ data: input });
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
        homePitcherId: z.number().optional(),
        awayPitcherId: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.game.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
