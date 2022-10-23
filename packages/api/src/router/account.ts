import { isAuthed, t } from "../trpc";

export const accountRouter = t.router({
  byUserId: t.procedure.use(isAuthed).query(({ ctx }) => {
    return ctx.prisma.account.findMany({
      where: { userId: ctx.session.user.id },
      select: { provider: true },
    });
  }),
});
