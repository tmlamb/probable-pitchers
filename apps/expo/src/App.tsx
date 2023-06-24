// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../types/next-auth.d.ts" />
import Constants from "expo-constants";

import { StatusBar } from "expo-status-bar";
import React from "react";
import * as Sentry from "sentry-expo";
import { useDeviceContext } from "twrnc";

import AuthProvider from "./components/AuthProvider";
import { Navigation } from "./components/Navigation";
import TRPCProvider from "./components/TRPCProvider";
import tw from "./tailwind";
//import { Platform } from "react-native";

const { sentryPublicDsn, appEnv } = Constants.expoConfig?.extra || {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: sentryPublicDsn,
    enableInExpoDevelopment: true,
    debug: appEnv !== "production",
  });
}

export default function App() {
  // https://github.com/jaredh159/tailwind-react-native-classnames#enabling-device-context-prefixes
  useDeviceContext(tw);

  //if (Platform.OS === "android") {
  // Necessary for localization of date times on Android
  //require("@formatjs/intl-getcanonicallocales/polyfill").default;
  //require("@formatjs/intl-locale/polyfill").default;
  //require("@formatjs/intl-pluralrules/polyfill").default;
  //require("@formatjs/intl-pluralrules/locale-data/en").default;
  //require("@formatjs/intl-numberformat/polyfill").default;
  //require("@formatjs/intl-numberformat/locale-data/en").default;
  //require("@formatjs/intl-datetimeformat/polyfill").default;
  //require("@formatjs/intl-datetimeformat/locale-data/en").default;
  //require("@formatjs/intl-datetimeformat/add-all-tz").default;
  //}

  return (
    <AuthProvider>
      <TRPCProvider>
        <Navigation />
        <StatusBar />
      </TRPCProvider>
    </AuthProvider>
  );
}
