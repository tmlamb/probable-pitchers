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
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { id: input.id },
      });
      if (subscription?.userId !== ctx.session.user.id) {
        throw new Error("User not authorized to update this subscription");
      }
      return ctx.prisma.subscription.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: t.procedure
    .use(isAuthed)
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { id: input },
      });
      if (subscription?.userId !== ctx.session.user.id) {
        throw new Error("User not authorized to delete this subscription");
      }
      return ctx.prisma.subscription.delete({ where: { id: input } });
    }),
});
