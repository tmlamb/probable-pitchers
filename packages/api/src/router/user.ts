import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const userRouter = t.router({
  delete: t.procedure.use(isAuthed).mutation(({ ctx }) => {
    return ctx.prisma.user.delete({ where: { id: ctx.session.user.id } });
  }),
  settings: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { notificationsEnabled: true },
    });
  }),
  toggleNotifications: t.procedure
    .use(isAuthed)
    .input(z.boolean())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { notificationsEnabled: input },
      });
    }),
});
