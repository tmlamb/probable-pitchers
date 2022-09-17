import { z } from "zod";
import { t } from "../trpc";

export const teamRouter = t.router({
  all: t.procedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany();
  }),
  byId: t.procedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.team.findUnique({ where: { id: input } });
  }),
  byName: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.team.findUnique({ where: { name: input } });
  }),
  create: t.procedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      console.log("creating team", input);
      return ctx.prisma.team.create({ data: input });
    }),
});
