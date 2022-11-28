import { Game, Pitcher, Subscription } from "@probable/db";
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

export const faqs = [
  {
    question: "How does the Probable Pitcher service work?",
    answer:
      "Our service monitors MLB's official API for game data. We then use that data to determine the probable pitcher for each game, and send you a mobile push notification if you are subscribed to that pitcher.",
  },
  {
    question: "What types of notifications will I receive?",
    answer:
      "You will receive one notification in the morning if one or more pitchers you are subscribed to pitch that day. You may receive additional notifications throughout the day if there are schedule updates that add a pitcher you are subscribed to.",
  },
  {
    question: "Why am I not receiving notifications?",
    answer:
      "Check your application settings and make sure notifications are enabled. Our service makes a best effort to send you notifications, but we cannot guarantee that you will receive them.",
  },
  {
    question: "My subscriptions are gone, where are they?",
    answer:
      "Subscriptions are tied to the account linked with your identity manager, like Google or Apple. So for instance, if you logged in previously with your Google account and added subscriptions, then later accessed the service with your Apple account, your Google account's subscriptions will not be available.",
  },
];
