import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import * as ExpoNotifications from "expo-notifications";
import { useSession } from "next-auth/expo";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, View } from "react-native";
import * as Sentry from "sentry-expo";
import {
  Account,
  Notifications,
  Settings,
  Subscriptions,
  Support,
  Welcome,
} from "../../screens/";
import tw from "../../tailwind";
import { trpc } from "../TRPCProvider";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { status } = useSession();

  const [expoPushToken, setExpoPushToken] = useState<string>();

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    function handleNotificationSetup() {
      if (status === "authenticated") {
        registerForPushNotifications().then((pushToken) => {
          setExpoPushToken(pushToken);
        });
      }
    }
    handleNotificationSetup();
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        handleNotificationSetup();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, [status]);

  const { data: device, isSuccess: deviceFetched } =
    trpc.device.byPushToken.useQuery(expoPushToken!, {
      enabled: !!expoPushToken && status === "authenticated",
    });

  const trpcContext = trpc.useContext();

  const { mutate: registerDevice } = trpc.device.create.useMutation({
    onError: (err) => {
      Sentry.Native.captureException(err);
    },
    onSettled: () => trpcContext.device.byPushToken.invalidate(),
  });
  const { mutate: updateDevice } = trpc.device.update.useMutation({
    onError: (err) => {
      Sentry.Native.captureException(err);
    },
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

  if (status === "authenticated") {
    trpcContext.subscription.byUserId.prefetch();
    trpcContext.account.byUserId.prefetch();
  }

  return (
    <View style={tw`flex-1 bg-slate-50 dark:bg-black`}>
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerBackTitleVisible: Platform.OS !== "android",
            headerTitleAlign: "center",
          }}
        >
          {status === "unauthenticated" && (
            <AppStack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerTitle: "",
                presentation: "modal",
                animation: "fade",
              }}
            />
          )}
          {status !== "unauthenticated" && (
            <>
              <AppStack.Screen
                name="Subscriptions"
                component={Subscriptions}
                options={{
                  headerTitle: "",
                  title: "Probable Pitcher",
                }}
              />
              <AppStack.Screen
                name="Settings"
                component={Settings}
                options={{
                  title: "Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Account"
                component={Account}
                options={{
                  title: "Account Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                  title: "Notification Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Support"
                component={Support}
                options={{
                  title: "Support",
                  headerBackTitle: "Back",
                }}
              />
            </>
          )}
        </AppStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const registerForPushNotifications = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await ExpoNotifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await ExpoNotifications.getExpoPushTokenAsync()).data;

    if (!token) {
      Sentry.Native.captureException(
        "Unable to get push token after permission was granted."
      );
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    ExpoNotifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
};
