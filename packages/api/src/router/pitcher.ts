import { Pitcher } from "@probable/db";
import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const pitcherRouter = t.router({
  byNameSearch: t.procedure
    .use(isAuthed)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const inputTokens = input.trim().split(" ");
      const searchResult: Pitcher[] = await ctx.prisma.pitcher.findMany({
        where: {
          OR: [
            {
              name: { search: inputTokens.join(" | ") },
            },
            {
              name: { contains: inputTokens.join(" ") },
            },
          ],
        },
        orderBy: {
          name: "asc",
        },
      });

      return searchResult.sort((a, b) => {
        if (a.name.startsWith(input) && !b.name.startsWith(input)) return -1;
        if (!a.name.startsWith(input) && b.name.startsWith(input)) return 1;
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
