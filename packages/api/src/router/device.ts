import { TRPCError } from "@trpc/server";
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
      ctx.prisma.device
        .findMany({
          where: { userId: ctx.session.user.id },
        })
        .then((devices) => {
          if (devices.length > 64) {
            console.warn(
              `Warning: Approaching 164 device per user system limit for User ID: ${ctx.session.user.id}`
            );
            if (devices.length > 164) {
              throw new TRPCError({
                code: "TOO_MANY_REQUESTS",
                message: `Error: User has way too many devices. User ID: ${ctx.session.user.id}.`,
              });
            }
          }

          return ctx.prisma.device.create({
            data: {
              ...input,
              userId: ctx.session.user.id,
            },
          });
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
