import { Game, Pitcher, Subscription } from "@prisma/client";
import {
  format,
  formatDistanceToNowStrict,
  isFuture,
  isToday,
  isTomorrow,
  min,
} from "date-fns";
import _ from "lodash";

function nextGameDate(
  pitcher: Pitcher & {
    homeGames: Game[];
    awayGames: Game[];
  }
): Date | undefined {
  const futureGames = [...pitcher.homeGames, ...pitcher.awayGames]
    .filter((game) => isFuture(game.date))
    .map((game) => game.date);
  if (futureGames.length) {
    return min(futureGames);
  }
}

export const subscriptionSchedule = (
  subscriptions:
    | (Subscription & {
        pitcher: Pitcher & {
          homeGames: Game[];
          awayGames: Game[];
        };
      })[]
    | undefined
): {
  nextGameDay: string;
  data: (Subscription & {
    pitcher: Pitcher & {
      homeGames: Game[];
      awayGames: Game[];
      nextGameDate?: Date;
    };
  })[];
}[] => {
  return _(subscriptions)
    .map((sub) => ({
      ...sub,
      pitcher: { ...sub.pitcher, nextGameDate: nextGameDate(sub.pitcher) },
    }))
    .orderBy((sub) => sub.pitcher.nextGameDate)
    .groupBy((sub) => {
      const date = sub.pitcher.nextGameDate;
      if (date) {
        const dateForSection = format(date, "EEE, MMM d");
        if (isToday(date)) {
          return `Pitching Today (${dateForSection})`;
        } else if (isTomorrow(date)) {
          return `Pitching Tomorrow (${dateForSection})`;
        } else {
          return `Pitching in ${formatDistanceToNowStrict(
            date
          )} (${dateForSection})`;
        }
      } else {
        return "Unscheduled";
      }
    })
    .map((data, nextGameDay) => ({ nextGameDay, data }))
    .value();
};
