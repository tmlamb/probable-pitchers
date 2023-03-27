import { Pitcher } from "@probable/db";
import { z } from "zod";
import { isAuthed, t } from "../trpc";

export const pitcherRouter = t.router({
  byFuzzyName: t.procedure
    .use(isAuthed)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const words = input.trim().split(" ");

      const query = words.reduce((acc, word, index) =>
        `${acc}${!!index && index < words.length ? ' ' : ''}*${word}*`, ''
      );

      return await ctx.prisma.$queryRaw<(Pitcher & { abbreviation: string })[]>
      `
        SELECT
            p.id,
            p.name,
            p.teamId,
            p.primaryNumber,
            t.abbreviation
        FROM
            Pitcher p
        INNER JOIN Team t ON t.id = p.teamId
        WHERE MATCH (p.name) AGAINST (${query} IN BOOLEAN MODE)
        LIMIT 18;
      `
    }),
});
