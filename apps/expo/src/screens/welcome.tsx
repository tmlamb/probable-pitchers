import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React from "react";
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import useDeviceIdStore from "../hooks/use-device-store";
import { trpc } from "../utils/trpc";

export const Welcome = () => {
  const { mutateAsync } = trpc.user.create.useMutation();

  const { deviceId, setIsFirstLaunch } = useDeviceIdStore((store) => store);

  async function setupUser() {
    const pushToken = await registerForPushNotificationsAsync();
    try {
      const createdUser = await mutateAsync({ deviceId, pushToken });
      setIsFirstLaunch(false);
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-5xl font-bold mx-auto pb-2">
          Welcome! Probable Pitchers is a free service that sends you a
          notification when your favorite players are scheduled to pitch. Once
          you proceed, the app will request your permission to send
          notifications to your device. You can modify this later in the
          application settings.
        </Text>
        <Pressable onPress={setupUser}>
          <Text>Proceed</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
