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
          userId: ctx.session?.user.id,
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
    .mutation(({ input, ctx }) => {
      const device = ctx.prisma.device.findUnique({
        where: { id: input.id },
      });
      Promise.resolve(device).then((dev) => {
        if (dev?.userId !== ctx.session?.user.id) {
          throw new Error("User not authorized to update this device");
        }
      });
      return ctx.prisma.device.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.device.findMany({
      where: { userId: ctx.session?.user.id },
    });
  }),
  byPushToken: t.procedure
    .use(isAuthed)
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.device.findUnique({
        where: { pushToken: input },
      });
    }),
});
