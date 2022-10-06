import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const subscriptionRouter = t.router({
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.subscription.findMany({
      where: { userId: ctx.session?.user.id },
      include: {
        pitcher: {
          include: {
            homeGames: true,
            awayGames: true,
          },
        },
      },
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
        data: { ...input, userId: ctx.session?.user.id, enabled: true },
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
    .mutation(({ ctx, input }) => {
      const subscription = ctx.prisma.subscription.findUnique({
        where: { id: input.id },
      });
      Promise.resolve(subscription).then((sub) => {
        if (sub?.userId !== ctx.session?.user.id) {
          throw new Error("User not authorized to update this subscription");
        }
      });
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
    .mutation(({ ctx, input }) => {
      const subscription = ctx.prisma.subscription.findUnique({
        where: { id: input },
      });
      Promise.resolve(subscription).then((sub) => {
        if (sub?.userId !== ctx.session?.user.id) {
          throw new Error("User not authorized to delete this subscription");
        }
      });
      return ctx.prisma.subscription.delete({ where: { id: input } });
    }),
});
