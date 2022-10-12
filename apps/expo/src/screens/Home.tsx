import { AntDesign } from "@expo/vector-icons";
import { Game, Pitcher, Subscription } from "@prisma/client";
import { useFocusEffect } from "@react-navigation/native";
import { add, isBefore, isFuture, maxTime, min } from "date-fns";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Platform,
  SectionList,
} from "react-native";
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
  SpecialText,
  specialTextColor,
  ThemedView,
} from "../components/Themed";
import { trpc } from "../components/TRPCProvider";
import tw from "../tailwind";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const [expoPushToken, setExpoPushToken] = useState<string>();

  useEffect(() => {
    registerForPushNotifications().then((pushToken) => {
      setExpoPushToken(pushToken);
    });
  }, []);

  const { data: device, isSuccess: deviceFetched } =
    trpc.device.byPushToken.useQuery(expoPushToken!, {
      enabled: !!expoPushToken,
    });

  const trpcContext = trpc.useContext();
  const { mutate: registerDevice } = trpc.device.create.useMutation({
    onSettled: () => trpcContext.device.byPushToken.invalidate(),
  });
  const { mutate: updateDevice } = trpc.device.update.useMutation({
    onSettled: () => trpcContext.device.byPushToken.invalidate(),
  });

  useEffect(() => {
    if (deviceFetched && expoPushToken) {
      const timezone = Localization.timezone;
      if (!device) {
        registerDevice({ pushToken: expoPushToken, timezone });
      } else if (device.timezone !== timezone) {
        updateDevice({
          id: device.id,
          pushToken: device.pushToken,
          timezone,
        });
      }
    }
  }, [device, deviceFetched, expoPushToken]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        registerForPushNotifications().then((pushToken) => {
          setExpoPushToken(pushToken);
        });
        setForceRenderKey((v) => v + 1);
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, []);

  const {
    data: subscriptions,
    isSuccess,
    isLoading,
    isError,
  } = trpc.subscription.byUserId.useQuery();

  const pitcherSubscriptions: {
    title: string;
    data: (Subscription & {
      pitcher: Pitcher & {
        homeGames: Game[];
        awayGames: Game[];
      };
    })[];
  }[] = _(subscriptions)
    .groupBy((subscription) => {
      const nextGame = nextGameDate(subscription.pitcher);
      return isBefore(nextGame || maxTime, add(new Date(), { hours: 24 }))
        ? "Pitching Today"
        : "Unscheduled";
    })
    .map((data, title) => ({ title, data }))
    .reverse()
    .value();

  // This forces the Dashboard to always re-render when visited.
  // This is a kludge to allow device theme changes to reflect
  // without restarting the app, since otherwise the Dashboard
  // may never re-render.
  const [forceRenderKey, setForceRenderKey] = React.useState(0);
  useFocusEffect(
    React.useCallback(() => {
      setForceRenderKey((v) => v + 1);
    }, [])
  );

  return (
    <ScreenLayout key={forceRenderKey}>
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
        sections={pitcherSubscriptions}
        ListHeaderComponent={
          <PrimaryText
            style={tw`text-4xl font-bold tracking-tight mb-9`}
            accessibilityRole="header"
          >
            Probable Pitcher
          </PrimaryText>
        }
        renderSectionHeader={({ section: { title } }) => (
          <SecondaryText style={tw`ml-3 mb-1.5 uppercase text-sm`}>
            {title}
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

const registerForPushNotifications = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (!token) {
      Sentry.Native.captureException(
        "Unable to get push token after permission was granted."
      );
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
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
