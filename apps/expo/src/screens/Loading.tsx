import React from "react";
import { ActivityIndicator, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { specialTextColor } from "../components/Themed";
import tw from "../tailwind";

export const Loading = () => {
  return (
    <ScreenLayout>
      <View style={tw`h-full w-full py-9 px-3 justify-center items-center`}>
        <ActivityIndicator
          size="large"
          color={String(tw.style(specialTextColor).color)}
        />
      </View>
    </ScreenLayout>
  );
};
