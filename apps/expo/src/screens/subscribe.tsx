import React, { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import useDeviceStore from "../hooks/use-device-store";
import { trpc } from "../utils/trpc";
import SearchInput from "./searchInput";

export const Subscribe = () => {
  const deviceId = useDeviceStore((store) => store.deviceId);
  const { data: user } = trpc.user.byDeviceId.useQuery(deviceId);

  const { data: subscriptions, refetch } = trpc.subscription.byUserId.useQuery(
    user?.id ?? -1,
    {
      enabled: !!user,
    }
  );

  const [searchFilter, setSearchFilter] = useState<string>();

  const { data: pitchers } = trpc.pitcher.byNameSearch.useQuery(
    searchFilter?.split(" ") || [],
    {
      enabled: !!searchFilter && !!user,
    }
  );

  const utils = trpc.useContext();

  const { mutateAsync: unsubscribe } = trpc.subscription.delete.useMutation({
    onSuccess() {
      utils.subscription.byUserId.invalidate();
    },
  });
  const { mutateAsync: subscribe } = trpc.subscription.create.useMutation({
    onSuccess() {
      utils.subscription.byUserId.invalidate();
    },
  });

  if (!user || !subscriptions) return null;

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-5xl font-bold mx-auto pb-2">
          Subscribe to pitcher
        </Text>
        <SearchInput
          onChange={(text) => {
            setSearchFilter(text);
          }}
        />
        {pitchers?.map((pitcher) => {
          const existingSubscription = subscriptions.find(
            (sub) => sub.pitcherId === pitcher.id
          );
          return (
            <View
              key={pitcher.id}
              className="flex-row my-9 align-center justify-between"
            >
              <Text className="text-center">{pitcher.name}</Text>
              {existingSubscription ? (
                <Pressable
                  onPress={() => {
                    unsubscribe(existingSubscription.id);
                  }}
                >
                  <Text>Unsubscribe</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    subscribe({
                      userId: user.id,
                      pitcherId: pitcher.id,
                    });
                  }}
                >
                  <Text>Subscribe</Text>
                </Pressable>
              )}
              {/* <Switch
              onValueChange={(value) => {
                console.log("onchange");
                pitcher.subscribed = value;
                const existingSub = subscriptions.find(
                  (s) => s.pitcherId === pitcher.id
                );
                if (existingSub) {
                  unsubscribe(existingSub.id);
                } else if (value) {
                  subscribe({
                    userId: user.id,
                    pitcherId: pitcher.id,
                  });
                }
              }}
              value={pitcher.subscribed}
            /> */}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
