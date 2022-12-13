import { Pitcher } from "@probable/db";
import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const pitcherRouter = t.router({
  byNameSearch: t.procedure
    .use(isAuthed)
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      const inputJoined = input.join(" ");
      const searchResult: Pitcher[] = await ctx.prisma.pitcher.findMany({
        where: {
          OR: [
            {
              name: { search: input.join(" | ") },
            },
            {
              name: { contains: inputJoined },
            },
          ],
        },
        orderBy: {
          name: "asc",
        },
      });

      return searchResult.sort((a, b) => {
        const startsWithA = a.name.startsWith(inputJoined);
        const startsWithB = b.name.startsWith(inputJoined);
        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return 0;
      });
    }),
  all: t.procedure.query(({ ctx }) => {
    return ctx.prisma.pitcher.findMany({
      where: {
        name: { not: "" },
      },
    });
  }),
});
