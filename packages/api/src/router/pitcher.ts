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

      const result = searchResult.sort((a, b) => {
        const startsWithA = a.name.startsWith(inputJoined);
        const startsWithB = b.name.startsWith(inputJoined);
        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return 0;
      });

      return result;
    }),
  byFuzzyName: t.procedure
    .use(isAuthed)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const words = input.trim().split(" ");

      const query = words.reduce((acc, word, index) =>
        `${acc}${!!index && index < words.length ? ' ' : ''}*${word}*`, ''
      );

      return await ctx.prisma.$queryRaw<Pitcher[]>`
        SELECT * FROM Pitcher
        WHERE MATCH (name) 
        AGAINST (${query} IN BOOLEAN MODE)
      `
    }),
});
