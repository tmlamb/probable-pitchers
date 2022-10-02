import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const subscriptionRouter = t.router({
  byPitcherId: t.procedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.subscription.findMany({
      where: { pitcherId: input, enabled: true },
    });
  }),
  byUserId: t.procedure
    .input(z.string())
    .use(isAuthed)
    .query(({ ctx, input }) => {
      return ctx.prisma.subscription.findMany({
        where: { userId: input },
      });
    }),
  byUserIdWithPitcher: t.procedure
    .input(z.string())
    .use(isAuthed)
    .query(({ ctx, input }) => {
      return ctx.prisma.subscription.findMany({
        where: { userId: input },
        include: { pitcher: true },
      });
    }),
  create: t.procedure
    .input(
      z.object({
        userId: z.string(),
        pitcherId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subscription.create({
        data: { ...input, enabled: true },
      });
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.number(),
        enabled: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subscription.update({
        where: { id: input.id },
        data: input,
      });
    }),
  delete: t.procedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.prisma.subscription.delete({ where: { id: input } });
  }),
});
