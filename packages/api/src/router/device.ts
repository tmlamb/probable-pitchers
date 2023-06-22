import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const deviceRouter = t.router({
  create: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        pushToken: z.string(),
        timezone: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.device.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  update: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
        pushToken: z.string(),
        timezone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.device.update({
        where: {
          id_userId: { userId: ctx.session.user.id, id: input.id },
        },
        data: input,
      });
    }),
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.device.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  byPushToken: t.procedure
    .use(isAuthed)
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.device.findUnique({
        where: {
          pushToken_userId: { pushToken: input, userId: ctx.session.user.id },
        },
      });
    }),
  toggleNotifications: t.procedure
    .use(isAuthed)
    .input(z.object({ id: z.string(), notificationsEnabled: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.device.update({
        where: {
          id_userId: { id: input.id, userId: ctx.session.user.id },
        },
        data: { notificationsEnabled: input.notificationsEnabled },
      });
    }),
});
