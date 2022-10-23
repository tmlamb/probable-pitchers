import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Linking, View } from "react-native";
import ButtonContainer from "../components/ButtonContainer";
import LinkButton from "../components/LinkButton";
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
        <LinkButton
          to={{ screen: "Account" }}
          accessibilityLabel="Navigate to account management screen"
        >
          <ThemedView style={tw`rounded-xl`}>
            <PrimaryText>Account</PrimaryText>
            <SecondaryText>
              <AntDesign name="user" size={24} />
            </SecondaryText>
          </ThemedView>
        </LinkButton>
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
