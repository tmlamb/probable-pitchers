import { AntDesign } from "@expo/vector-icons";
import { Game, Pitcher, Subscription } from "@prisma/client";
import {
  format,
  formatDistanceToNowStrict,
  isFuture,
  isToday,
  isTomorrow,
  min,
} from "date-fns";
import { Subscription as ExpoSubscription } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, SectionList } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import HeaderLeftContainer from "../components/HeaderLeftContainer";
import HeaderRightContainer from "../components/HeaderRightContainer";
import LinkButton from "../components/LinkButton";
import { RootStackScreenProps } from "../components/Navigation";
import ScreenLayout from "../components/ScreenLayout";
import {
  AlertText,
  PrimaryText,
  SecondaryText,
  SpecialText,
  specialTextColor,
  ThemedView,
} from "../components/Themed";
import { trpc } from "../components/TRPCProvider";
import tw from "../tailwind";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<ExpoSubscription>();
  const responseListener = useRef<ExpoSubscription>();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      ExpoNotifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener((response) => {
        navigate("Home");
      });

    return () => {
      if (notificationListener?.current) {
        ExpoNotifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener?.current) {
        ExpoNotifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, []);

  const {
    data: subscriptions,
    isSuccess,
    isLoading,
    isError,
  } = trpc.subscription.byUserId.useQuery();

  const subscriptionsSchedule: {
    nextGameDay: string;
    data: (Subscription & {
      pitcher: Pitcher & {
        homeGames: Game[];
        awayGames: Game[];
      };
    })[];
  }[] = _(subscriptions)
    .orderBy((sub) => nextGameDate(sub.pitcher))
    .groupBy((sub) => {
      const date = nextGameDate(sub.pitcher) || undefined;
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

  return (
    <ScreenLayout>
      <HeaderLeftContainer>
        <LinkButton
          to={{ screen: "Settings" }}
          style={tw`py-6 pl-2.5 pr-8 -my-6 -ml-4 web:-ml-3`}
          accessibilityLabel="Navigate to Application Settings"
        >
          <SpecialText>
            <AntDesign name="setting" size={24} />
          </SpecialText>
        </LinkButton>
      </HeaderLeftContainer>
      <HeaderRightContainer>
        <LinkButton
          to={{ screen: "Subscribe" }}
          style={tw`py-6 pl-8 pr-3 -my-6 -mr-4`}
          accessibilityLabel="Navigate to subscription management screen"
        >
          <SpecialText>
            <AntDesign name="plus" size={24} />
          </SpecialText>
        </LinkButton>
      </HeaderRightContainer>
      <SectionList
        contentContainerStyle={tw`px-3 pt-9 pb-12`}
        bounces={false}
        sections={subscriptionsSchedule}
        ListHeaderComponent={
          <PrimaryText
            style={tw`text-4xl font-bold tracking-tight mb-9`}
            accessibilityRole="header"
          >
            Probable Pitcher
          </PrimaryText>
        }
        renderSectionHeader={({ section: { nextGameDay } }) => (
          <SecondaryText style={tw`ml-3 mb-1.5 uppercase text-sm`}>
            {nextGameDay}
          </SecondaryText>
        )}
        renderItem={({ index, item, section }) => (
          <Animated.View entering={FadeIn.delay(150)} exiting={FadeOut}>
            <ThemedView
              key={item.id}
              style={tw.style(
                "border-b-2",
                index === 0 ? "rounded-t-xl" : undefined,
                index + 1 === section.data.length
                  ? "rounded-b-xl border-b-0 mb-6"
                  : undefined
              )}
            >
              <PrimaryText style={tw`flex-1`} numberOfLines={1}>
                {item.pitcher.name}
              </PrimaryText>
            </ThemedView>
          </Animated.View>
        )}
        ListEmptyComponent={
          <>
            {isSuccess && (
              <Animated.View entering={FadeIn.delay(150)} exiting={FadeOut}>
                <SecondaryText
                  style={tw`mb-9 mx-3 text-sm`}
                  accessibilityRole="summary"
                >
                  To get started, add an alert subscription for your favorite
                  pitcher.
                </SecondaryText>
                <LinkButton
                  to={{ screen: "Subscribe" }}
                  accessibilityLabel="Navigate to subscription management screen"
                >
                  <ThemedView rounded>
                    <SpecialText>Add Subscription</SpecialText>
                  </ThemedView>
                </LinkButton>
              </Animated.View>
            )}
            {isLoading && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <ActivityIndicator
                  size="large"
                  color={String(tw.style(specialTextColor).color)}
                />
              </Animated.View>
            )}
            {isError && (
              <Animated.View entering={FadeIn.delay(150)} exiting={FadeOut}>
                <AlertText
                  style={tw`mb-9 mx-3 text-sm`}
                  accessibilityRole="alert"
                >
                  An error occurred while loading your subscriptions. Please try
                  again later.
                </AlertText>
              </Animated.View>
            )}
          </>
        }
      />
    </ScreenLayout>
  );
};

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
