import * as AppleAuthentication from "expo-apple-authentication";
import { signIn } from "next-auth/expo";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import { useAppColorScheme } from "twrnc";
import { appleLogin, googleLogin } from "../components/AuthProvider";
import ModalLayout from "../components/ModalLayout";
import {
  PrimaryText,
  SpecialText,
  specialTextColor,
} from "../components/Themed";
import tw from "../tailwind";

export const Welcome = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [colorScheme] = useAppColorScheme(tw);
  return (
    <ModalLayout>
      <View style={tw`h-full w-full py-9 px-3 justify-evenly`}>
        <View>
          <SpecialText style={tw`text-2xl font-bold mx-auto pb-9`}>
            Welcome!
          </SpecialText>
          <PrimaryText style={tw`text-lg text-center pb-9`}>
            Probable Pitcher is a notification service that sends you an alert on
            the days your favorite players are scheduled to pitch.
          </PrimaryText>
          <PrimaryText style={tw`text-lg text-center`}>
            Sign in with one of the options below. You will be asked to grant
            permission for the app to send notifications to your device.
          </PrimaryText>
        </View>
        {!isSigningIn ? (
          <View>
            <Pressable
              style={tw`mx-auto active:opacity-10`}
              onPress={async () => {
                setIsSigningIn(true);
                await signIn(() => googleLogin());
                setIsSigningIn(false);
              }}
            >
              <Image
                style={tw`w-[200px] h-[43.24px]`}
                source={require("../../assets/google_signin_buttons/btn_google_signin_dark_normal_web.png")}
              />
            </Pressable>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                colorScheme === "dark"
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={1}
              style={tw`mx-auto mt-9 w-[200px] h-[43.24px] active:opacity-10`}
              onPress={async () => {
                setIsSigningIn(true);
                await signIn(() => appleLogin());
                setIsSigningIn(false);
              }}
            />
          </View>
        ) : (
          <ActivityIndicator
            style={tw`mt-9 h-[86.48px]`}
            size="large"
            color={String(tw.style(specialTextColor).color)}
          />
        )}
      </View>
    </ModalLayout>
  );
};
