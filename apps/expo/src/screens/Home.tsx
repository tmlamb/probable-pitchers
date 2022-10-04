import { AntDesign } from "@expo/vector-icons";
import { signOut } from "next-auth/expo";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import HeaderRightContainer from "../components/HeaderRightContainer";
import LinkButton from "../components/LinkButton";
import { RootStackScreenProps } from "../components/Navigation";
import { SpecialText } from "../components/Themed";
import { trpc } from "../components/TRPCProvider";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const { data: subscriptions } = trpc.subscription.byUserId.useQuery();

  return (
    <>
      <HeaderRightContainer>
        <LinkButton
          to={{ screen: "Subscribe" }}
          className={"py-6 pl-8 pr-3 -my-6 -mr-4"}
          accessibilityLabel="Navigate to subscription management screen"
        >
          <SpecialText>
            <AntDesign name="plus" size={28} />
          </SpecialText>
        </LinkButton>
      </HeaderRightContainer>
      <SafeAreaView>
        <View className="h-full w-full p-4">
          <Text className="text-5xl font-bold mx-auto pb-2">
            Probable Pitchers
          </Text>
          {subscriptions?.map((sub) => (
            <View key={sub.id}>
              <Text>{sub.pitcher.name}</Text>
            </View>
          ))}
          <Pressable onPress={signOut}>
            <Text>Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
};
