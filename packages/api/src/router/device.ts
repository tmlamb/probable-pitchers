import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const deviceRouter = t.router({
  create: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.device.create({
        data: { pushToken: input.token, userId: ctx.session?.user.id },
      });
    }),
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.device.findMany({
      where: { userId: ctx.session?.user.id },
    });
  }),
});
