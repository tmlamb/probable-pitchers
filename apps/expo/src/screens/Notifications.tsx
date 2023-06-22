import { useTrackParallelMutations } from "@probable/common";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Linking, Switch, View } from "react-native";
import * as Sentry from "sentry-expo";
import ButtonContainer from "../components/ButtonContainer";
import ScreenLayout from "../components/ScreenLayout";
import {
  PrimaryText,
  SecondaryText,
  secondaryTextColor,
  SpecialText,
  specialTextColor,
  ThemedView,
} from "../components/Themed";
import { trpc } from "../components/TRPCProvider";
import tw from "../tailwind";

export const Notifications = () => {
  const utils = trpc.useContext();

  const mutationTracker = useTrackParallelMutations();

  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const { data: device, isSuccess: deviceFetched } =
    trpc.device.byPushToken.useQuery(expoPushToken, {
      enabled: !!expoPushToken && !mutationTracker.isMutating(),
    });

  const { mutate: toggleNotifications } =
    trpc.device.toggleNotifications.useMutation({
      onMutate: async ({ notificationsEnabled }) => {
        await utils.device.byPushToken.cancel(expoPushToken);
        mutationTracker.startOne();
        const currentDevice = utils.device.byPushToken.getData(expoPushToken);
        utils.device.byPushToken.setData(expoPushToken, (old) =>
          old
            ? {
                ...old,
                notificationsEnabled,
              }
            : null
        );
        return { currentDevice };
      },
      onError: (err, _, context) => {
        utils.device.byPushToken.setData(expoPushToken, context?.currentDevice);
        Sentry.Native.captureException(err);
      },
      onSettled: () => {
        mutationTracker.endOne();
        if (mutationTracker.allEnded()) {
          utils.device.byPushToken.invalidate(expoPushToken);
        }
      },
    });

  const appState = useRef(AppState.currentState);

  const [permissionGranted, setPermissionGranted] = useState(true);

  useEffect(() => {
    function checkStatus() {
      ExpoNotifications.getPermissionsAsync().then(({ status }) => {
        setPermissionGranted(status === PermissionStatus.GRANTED);
      });
      ExpoNotifications.getExpoPushTokenAsync().then(({ data: token }) => {
        setExpoPushToken(token);
      });
    }
    checkStatus();

    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkStatus();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <ScreenLayout>
      <View style={tw`flex-1 px-4 py-6`}>
        <ThemedView style={tw`rounded-xl`}>
          <PrimaryText style={tw``}>Notifications Enabled</PrimaryText>
          <Switch
            trackColor={{
              true: String(tw.style(specialTextColor).color),
              false: String(tw.style(secondaryTextColor).color),
            }}
            ios_backgroundColor={String(tw.style(secondaryTextColor).color)}
            onValueChange={() =>
              device
                ? toggleNotifications({
                    id: device.id,
                    notificationsEnabled: !device.notificationsEnabled,
                  })
                : undefined
            }
            value={device?.notificationsEnabled && permissionGranted}
            disabled={
              !deviceFetched ||
              !permissionGranted ||
              !device ||
              mutationTracker.isMutating()
            }
          />
        </ThemedView>
        {!permissionGranted && (
          <>
            <SecondaryText
              style={tw`mx-4 mt-1.5 text-sm`}
              accessibilityRole="summary"
            >
              Permission to receive notifications from this app has been denied
              in your device&apos;s settings. To receive Probable Pitcher
              alerts, allow this app to send notifications.
            </SecondaryText>
            <ButtonContainer
              style={tw`mx-4 mt-1.5`}
              onPress={Linking.openSettings}
            >
              <SpecialText style={tw`text-sm`}>
                Open Application Settings
              </SpecialText>
            </ButtonContainer>
          </>
        )}
      </View>
    </ScreenLayout>
  );
};
