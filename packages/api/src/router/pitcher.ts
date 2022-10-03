import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const pitcherRouter = t.router({
  byNameSearch: t.procedure
    .use(isAuthed)
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
