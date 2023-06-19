import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import { Subscription as ExpoSubscription } from "expo-modules-core";
import { useSession } from "next-auth/expo";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import * as Sentry from "sentry-expo";
import { trpc } from "../components/TRPCProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/Navigation";

export const useNotifications = () => {
  const { status } = useSession();

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [, setNotification] = useState(false);

  const appState = useRef(AppState.currentState);
  const notificationListener = useRef<ExpoSubscription>();
  const responseListener = useRef<ExpoSubscription>();

  useEffect(() => {
    function handleNotificationSetup() {
      if (status === "authenticated") {
        registerForPushNotifications().then((pushToken) => {
          setExpoPushToken(pushToken);
        });
      }
    }
    handleNotificationSetup();
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        handleNotificationSetup();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, [status]);

  const { data: device, isSuccess: deviceFetched } =
    trpc.device.byPushToken.useQuery(expoPushToken || "", {
      enabled: !!expoPushToken && status === "authenticated",
    });

  const trpcContext = trpc.useContext();

  const { mutate: registerDevice } = trpc.device.create.useMutation({
    onError: (err) => {
      Sentry.Native.captureException(err);
    },
    onSettled: () => trpcContext.device.byPushToken.invalidate(),
  });
  const { mutate: updateDevice } = trpc.device.update.useMutation({
    onError: (err) => {
      Sentry.Native.captureException(err);
    },
    onSettled: () => trpcContext.device.byPushToken.invalidate(),
  });

  useEffect(() => {
    if (deviceFetched && expoPushToken) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(timezone);
      if (!device) {
        registerDevice({ pushToken: expoPushToken, timezone });
      } else if (device.timezone !== timezone) {
        updateDevice({
          id: device.id,
          pushToken: device.pushToken,
          timezone,
        });
      }
    }
  }, [device, deviceFetched, expoPushToken, registerDevice, updateDevice]);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      ExpoNotifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(() => {
        navigation.navigate("Subscriptions");
      });

    return () => {
      if (notificationListener?.current) {
        ExpoNotifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener?.current) {
        ExpoNotifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, [navigation]);
};

const registerForPushNotifications = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await ExpoNotifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await ExpoNotifications.getExpoPushTokenAsync()).data;

    if (!token) {
      Sentry.Native.captureException(
        "Unable to get push token after permission was granted."
      );
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    ExpoNotifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
};
