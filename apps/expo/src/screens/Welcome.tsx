import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { signIn } from "next-auth/expo";
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import { socialLogin } from "../components/AuthProvider";

export const Welcome = () => {
  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-2xl font-bold mx-auto pb-2">
          Welcome! Probable Pitchers is a free service that sends you a
          notification when your favorite players are scheduled to pitch.
        </Text>
        <Pressable onPress={() => signIn(() => socialLogin())}>
          <Text>Login with Google</Text>
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
