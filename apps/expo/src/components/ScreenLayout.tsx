import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useDetectThemeChange } from "../hooks/use-detect-theme-change";
import tw from "../tailwind";
import { primaryTextColor } from "./Themed";

export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useNavigation();

  const forceRenderKey = useDetectThemeChange();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: tw`bg-slate-50 dark:bg-black`,
      headerTitleStyle: tw.style(primaryTextColor),
      headerShadowVisible: false,
      headerTintColor: tw.style(primaryTextColor).color,
      headerBackTitleStyle: tw.style(primaryTextColor),
    });
  }, [navigation, forceRenderKey]);

  return (
    <View key={forceRenderKey} style={tw`flex-1 bg-slate-50 dark:bg-black`}>
      {children}
    </View>
  );
}
