import Constants from "expo-constants";
import { Subscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";
import { useDeviceContext } from "twrnc";
import AuthProvider from "./components/AuthProvider";
import { Navigation } from "./components/Navigation";
import TRPCProvider from "./components/TRPCProvider";
import tw from "./tailwind";

const { sentryPublicDsn, appEnv } = Constants.expoConfig?.extra || {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: sentryPublicDsn,
    enableInExpoDevelopment: true,
    debug: appEnv !== "production",
  });
}

export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  // https://github.com/jaredh159/tailwind-react-native-classnames#enabling-device-context-prefixes
  useDeviceContext(tw);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      if (notificationListener?.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener?.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <TRPCProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </AuthProvider>
  );
}
