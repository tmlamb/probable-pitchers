import { z } from "zod";
import { t } from "../trpc";

export const teamRouter = t.router({
  byId: t.procedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.team.findUnique({ where: { id: input } });
  }),
  create: t.procedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.team.create({ data: input });
    }),
  update: t.procedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.team.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
