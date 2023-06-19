import { AntDesign } from "@expo/vector-icons";
import { providerLabels } from "@probable/api";
import { signOut } from "next-auth/expo";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import ButtonContainer from "../components/ButtonContainer";
import DoubleConfirm from "../components/DoubleConfirm";
import ScreenLayout from "../components/ScreenLayout";
import {
  AlertText,
  PrimaryText,
  SecondaryText,
  ThemedView,
} from "../components/Themed";
import { trpc } from "../components/TRPCProvider";
import tw from "../tailwind";

export const Account = () => {
  const { data: accounts } = trpc.account.byUserId.useQuery(undefined, {
    staleTime: Infinity,
  });

  const provider = accounts?.map(
    (account) => providerLabels[account.provider as keyof typeof providerLabels]
  )[0];

  const { mutate: deleteAccount } = trpc.user.delete.useMutation({});

  return (
    <ScreenLayout>
      <View style={tw`flex-1 px-4 py-6`}>
        <ThemedView style={tw`border-b-2 rounded-t-xl`}>
          <PrimaryText style={tw``}>Identity Provider</PrimaryText>
          {provider ? (
            <SecondaryText style={tw``}>{provider}</SecondaryText>
          ) : (
            <ActivityIndicator size="small" />
          )}
        </ThemedView>
        <ButtonContainer onPress={signOut} accessibilityLabel={"Logout"}>
          <ThemedView style={tw.style("rounded-b-xl")}>
            <SecondaryText>Logout</SecondaryText>
            <SecondaryText style={tw``}>
              <AntDesign name="logout" size={18} />
            </SecondaryText>
          </ThemedView>
        </ButtonContainer>
        <DoubleConfirm
          style={tw`mt-6`}
          first={
            <ThemedView style={tw`rounded-xl`}>
              <AlertText>Delete Account</AlertText>
            </ThemedView>
          }
          second={
            <ButtonContainer
              onPress={() => {
                deleteAccount();
                signOut();
              }}
            >
              <AlertText style={tw`px-4 py-3 -my-3`}>
                <AntDesign name="minuscircle" size={15} />
              </AlertText>
            </ButtonContainer>
          }
          accessibilityLabel={`Delete account and all user data`}
        />
      </View>
    </ScreenLayout>
  );
};
