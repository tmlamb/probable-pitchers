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
import { useTrackParallelMutations } from "../hooks/use-track-parallel-mutations";
import tw from "../tailwind";

export const Notifications = () => {
  const { data: settings, isSuccess: settingsFetched } =
    trpc.user.settings.useQuery();

  const utils = trpc.useContext();

  const mutationTracker = useTrackParallelMutations();

  const { mutate: toggleNotifications } =
    trpc.user.toggleNotifications.useMutation({
      onMutate: (notificationsEnabled) => {
        mutationTracker.startOne();
        const currentSettings = utils.user.settings.getData();
        utils.user.settings.setData((old) => ({
          ...old,
          notificationsEnabled,
        }));
        return { currentSettings };
      },
      onError: (err, notificationsEnabled, context) => {
        utils.user.settings.setData(context?.currentSettings);
        Sentry.Native.captureException(err);
      },
      onSettled: () => {
        mutationTracker.endOne();
        utils.user.settings.invalidate();
      },
    });

  const appState = useRef(AppState.currentState);
  const [permissionGranted, setPermissionGranted] = useState(true);
  useEffect(() => {
    function checkStatus() {
      ExpoNotifications.getPermissionsAsync().then((status) => {
        setPermissionGranted(status.status === PermissionStatus.GRANTED);
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
      <View style={tw`flex-1 px-3 py-9`}>
        <ThemedView style={tw`rounded-xl`}>
          <PrimaryText style={tw``}>Notifications Enabled</PrimaryText>
          <Switch
            trackColor={{
              true: String(tw.style(specialTextColor).color),
              false: String(tw.style(secondaryTextColor).color),
            }}
            ios_backgroundColor={String(tw.style(secondaryTextColor).color)}
            onValueChange={toggleNotifications}
            value={settings?.notificationsEnabled && permissionGranted}
            disabled={
              !settingsFetched ||
              !permissionGranted ||
              mutationTracker.isMutating()
            }
          />
        </ThemedView>
        {!permissionGranted && (
          <>
            <SecondaryText
              style={tw`mx-3 mt-1.5 text-sm`}
              accessibilityRole="summary"
            >
              Permission to receive notifications from this app have been denied
              in this device's settings. To receive Probable Pitcher alerts,
              allow this app to send notifications.
            </SecondaryText>
            <ButtonContainer
              style={tw`mx-3 mt-1.5`}
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
