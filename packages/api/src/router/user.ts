import { z } from "zod";
import { t } from "../trpc";

export const userRouter = t.router({
  create: t.procedure
    .input(z.object({ deviceId: z.string(), pushToken: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({ data: input });
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        deviceId: z.string(),
        pushToken: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: input,
      });
    }),
  // byDeviceId: t.procedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.user.findUnique({ where: { deviceId: input } });
  // }),
  byId: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input } });
  }),
});
