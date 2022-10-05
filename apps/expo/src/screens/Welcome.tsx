import { signIn } from "next-auth/expo";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { socialLogin } from "../components/AuthProvider";
import ModalLayout from "../components/ModalLayout";
import tw from "../tailwind";

export const Welcome = () => {
  return (
    <ModalLayout>
      <View style={tw`h-full w-full p-4`}>
        <Text style={tw`text-2xl font-bold mx-auto pb-2`}>
          Welcome! Probable Pitchers is a free service that sends you a
          notification when your favorite players are scheduled to pitch.
        </Text>
        <Pressable onPress={() => signIn(() => socialLogin())}>
          <Text>Login with Google</Text>
        </Pressable>
      </View>
    </ModalLayout>
  );
};
