/// <reference path="../../../types/next-auth.d.ts" />
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { enableLayoutAnimations } from "react-native-reanimated";
import * as Sentry from "sentry-expo";
import AuthProvider from "./components/AuthProvider";
import { Navigation } from "./components/Navigation";
import TRPCProvider from "./components/TRPCProvider";

const { sentryPublicDsn, appEnv } = Constants.expoConfig?.extra || {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: sentryPublicDsn,
    enableInExpoDevelopment: true,
    debug: appEnv !== "production",
  });
}

export default function App() {
  if (Platform.OS === "android") {
    enableLayoutAnimations(false);
  }

  return (
    <AuthProvider>
      <TRPCProvider>
        <Navigation />
        <StatusBar />
      </TRPCProvider>
    </AuthProvider>
  );
}
