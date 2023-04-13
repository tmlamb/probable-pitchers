import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const userRouter = t.router({
  delete: t.procedure.use(isAuthed).mutation(({ ctx }) => {
    return ctx.prisma.user.delete({ where: { id: ctx.session.user.id } });
  }),
});
