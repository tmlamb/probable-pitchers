import { AntDesign } from "@expo/vector-icons";
import { faqs } from "@probable/common";
import React from "react";
import { Linking, ScrollView, View } from "react-native";
import ButtonContainer from "../components/ButtonContainer";
import ScreenLayout from "../components/ScreenLayout";
import { PrimaryText, SecondaryText, SpecialText } from "../components/Themed";
import tw from "../tailwind";

export const Support = () => {
  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={tw`justify-between px-3 pt-9 pb-9 flex-1`}
      >
        <View style={tw``}>
          <PrimaryText style={tw`text-lg mb-4`}>FAQs</PrimaryText>
          {faqs.map((faq) => (
            <View key={faq.question} style={tw`mb-4`}>
              <PrimaryText style={tw`font-bold text-base`}>
                {faq.question}
              </PrimaryText>
              <SecondaryText style={tw`text-sm`}>{faq.answer}</SecondaryText>
            </View>
          ))}
        </View>
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
      </ScrollView>
    </ScreenLayout>
  );
};
