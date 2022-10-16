import { signIn } from "next-auth/expo";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { appleLogin, googleLogin } from "../components/AuthProvider";
import ModalLayout from "../components/ModalLayout";
import { PrimaryText, SpecialText } from "../components/Themed";
import tw from "../tailwind";

export const Welcome = () => {
  return (
    <ModalLayout>
      <View style={tw`h-full w-full py-9 px-3`}>
        <SpecialText style={tw`text-2xl font-bold mx-auto pb-9`}>
          Welcome!
        </SpecialText>
        <PrimaryText style={tw`text-lg text-center pb-9`}>
          Probable Pitcher is a notification service that sends you an alert on
          the days your favorite players are scheduled to pitch.
        </PrimaryText>
        <PrimaryText style={tw`text-lg text-center pb-9`}>
          Sign in with one of the options below. You will be asked to grant
          permission for the app to send notifications to your device.
        </PrimaryText>
        <Pressable
          style={tw`mx-auto pt-9`}
          onPress={() => signIn(() => googleLogin())}
        >
          <Image
            style={tw`w-[191px] h-[46px]`}
            source={require("../../assets/google_signin_buttons/btn_google_signin_dark_normal_web.png")}
          />
        </Pressable>
        <Pressable
          style={tw`mx-auto pt-9`}
          onPress={() => signIn(() => appleLogin())}
        >
          <Image
            style={tw`w-[185px] h-[41px]`}
            source={require("../../assets/apple_signin_buttons/appleid_button.png")}
          />
        </Pressable>
      </View>
    </ModalLayout>
  );
};
