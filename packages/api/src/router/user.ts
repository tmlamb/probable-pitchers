import { z } from "zod";
import { t } from "../trpc";

export const userRouter = t.router({
  byId: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input } });
  }),
});
