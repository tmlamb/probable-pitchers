import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const subscriptionRouter = t.router({
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.subscription.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        pitcher: {
          include: {
            homeGames: true,
            awayGames: true,
            team: true,
          },
        },
      },
      orderBy: { pitcher: { name: "asc" } },
    });
  }),
  create: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        pitcherId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subscription.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
  update: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.number(),
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.subscription.update({
        where: {
          id_userId: { id: input.id, userId: ctx.session.user.id },
        },
        data: input,
      });
    }),
  delete: t.procedure
    .use(isAuthed)
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.subscription.delete({
        where: {
          id_userId: { id: input, userId: ctx.session.user.id }
        }
      });
    }),
});
