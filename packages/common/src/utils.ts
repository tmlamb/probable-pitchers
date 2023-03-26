import { Game, Pitcher, Subscription, Team } from "@probable/db";
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


export type PitcherSubscription =
  Pitcher & {
    team: { abbreviation: string | null },
    homeGames?: Game[],
    awayGames?: Game[],
    nextGameDate?: Date,
    subscription?: Subscription
  };

export const subscriptionSchedule = (
  subscriptions:
    | (Subscription & {
      pitcher: Pitcher & {
        team: { abbreviation: string | null },
        homeGames: Game[];
        awayGames: Game[];
      };
    })[]
    | undefined
): {
  nextGameDay: string;
  data: PitcherSubscription[];
}[] => {
  return _(subscriptions)
    .map((s) => ({
      ...s.pitcher,
      nextGameDate: nextGameDate(s.pitcher),
      subscription: {
        id: s.id,
        userId: s.userId,
        pitcherId: s.pitcherId,
      }
    }))
    .orderBy((p) => p.nextGameDate)
    .groupBy((p) => {
      const date = p.nextGameDate;
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

