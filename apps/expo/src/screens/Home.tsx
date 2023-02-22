import { AntDesign } from "@expo/vector-icons";
import { subscriptionSchedule } from "@probable/common";
import { formatInTimeZone } from "date-fns-tz";
import * as Localization from "expo-localization";
import { Subscription as ExpoSubscription } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import { useSession } from "next-auth/expo";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, SectionList } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Sentry from "sentry-expo";
import HeaderLeftContainer from "../components/HeaderLeftContainer";
import HeaderRightContainer from "../components/HeaderRightContainer";
import LinkButton from "../components/LinkButton";
import { RootStackScreenProps } from "../components/Navigation";
import ScreenLayout from "../components/ScreenLayout";
import {
  AlertText,
  PrimaryText,
  SecondaryText,
  secondaryTextColor,
  SpecialText,
  ThemedView,
} from "../components/Themed";
import { trpc } from "../components/TRPCProvider";
import tw from "../tailwind";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const { status } = useSession();
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
    error,
  } = trpc.subscription.byUserId.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (isError) {
    Sentry.Native.captureException(
      `Error fetching subscriptions on homepage: ${error}`
    );
  }

  const schedule = subscriptionSchedule(subscriptions);

  if (status !== "authenticated") {
    return (
      <ScreenLayout>
        <Animated.View
          style={tw`absolute w-screen h-screen justify-center`}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <ActivityIndicator
            size="large"
            color={String(tw.style(secondaryTextColor).color)}
          />
        </Animated.View>
      </ScreenLayout>
    );
  }

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
      {schedule && schedule.length > 0 &&
        <HeaderRightContainer>
          <LinkButton
            to={{ screen: "Subscriptions" }}
            style={tw`py-6 pl-8 pr-3 -my-6 -mr-4`}
            accessibilityLabel="Navigate to subscription management screen"
          >
            <SpecialText>
              <AntDesign name="edit" size={24} />
            </SpecialText>
          </LinkButton>
        </HeaderRightContainer>
      }
      <SectionList
        contentContainerStyle={tw`px-3 pt-9 pb-12`}
        bounces={false}
        sections={schedule}
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
              {item.pitcher.nextGameDate && (
                <SecondaryText style={tw`ml-1.5 text-sm`}>
                  {formatInTimeZone(
                    item.pitcher.nextGameDate,
                    Localization.timezone,
                    "h:mmaaaaa"
                  )}
                </SecondaryText>
              )}
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
                  to={{ screen: "Subscriptions" }}
                  accessibilityLabel="Navigate to subscription management screen"
                >
                  <ThemedView rounded>
                    <SpecialText>Add Subscription</SpecialText>
                  </ThemedView>
                </LinkButton>
              </Animated.View>
            )}
            {isLoading && (
              <Animated.View
                style={tw`absolute w-screen h-screen justify-center`}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <ActivityIndicator
                  size="large"
                  color={String(tw.style(secondaryTextColor).color)}
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
