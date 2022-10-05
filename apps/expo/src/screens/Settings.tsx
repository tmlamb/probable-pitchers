import { AntDesign } from "@expo/vector-icons";
import { signOut } from "next-auth/expo";
import React from "react";
import { Linking, View } from "react-native";
import ButtonContainer from "../components/ButtonContainer";
import ScreenLayout from "../components/ScreenLayout";
import {
  PrimaryText,
  SecondaryText,
  SpecialText,
  ThemedView,
} from "../components/Themed";
import tw from "../tailwind";

export const Settings = () => {
  return (
    <ScreenLayout>
      <View style={tw`flex-1 px-3 py-9 justify-between`}>
        <ButtonContainer onPress={signOut} accessibilityLabel={"Logout"}>
          <ThemedView
            style={tw.style("relative border-b-0 rounded-b-xl rounded-t-xl")}
          >
            <PrimaryText>Logout</PrimaryText>
            <SecondaryText style={tw`absolute right-2 self-center`}>
              <AntDesign name="setting" size={20} />
            </SecondaryText>
          </ThemedView>
        </ButtonContainer>
        <ButtonContainer
          onPress={() =>
            Linking.openURL(
              "https://github.com/tmlamb/probable-pitchers/issues"
            )
          }
          accessibilityRole="link"
          accessibilityLabel="Open Application Feedback Page In Browser"
          style={tw`flex-row justify-center items-center self-center py-2`}
        >
          <SecondaryText style={tw`mr-2`}>
            <AntDesign name="github" size={16} />
          </SecondaryText>
          <SpecialText style={tw`self-center`}>Feedback?</SpecialText>
        </ButtonContainer>
      </View>
    </ScreenLayout>
  );
};
