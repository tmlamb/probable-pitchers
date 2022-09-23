import { z } from "zod";
import { t } from "../trpc";

export const pitcherRouter = t.router({
  byId: t.procedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.pitcher.findUnique({ where: { id: input } });
  }),
  create: t.procedure
    .input(z.object({ id: z.number(), name: z.string(), teamId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.pitcher.create({ data: input });
    }),
  createMany: t.procedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          teamId: z.number(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.pitcher.createMany({ data: input });
    }),
  update: t.procedure
    .input(z.object({ id: z.number(), name: z.string(), teamId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.pitcher.update({
        where: { id: input.id },
        data: input,
      });
    }),
  byNameSearch: t.procedure
    .input(z.array(z.string()))
    .query(({ ctx, input }) => {
      return ctx.prisma.pitcher.findMany({
        where: {
          OR: [
            {
              name: { search: input.join(" | ") },
            },
            {
              name: { search: input.join(" ") },
            },
            {
              name: { startsWith: input.join(" ") },
            },
            {
              name: { contains: input.join(" ") },
            },
          ],
        },
      });
    }),
});
