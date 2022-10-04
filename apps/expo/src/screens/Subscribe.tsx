import { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import SearchInput from "../components/SearchInput";
import { trpc } from "../components/TRPCProvider";

export const Subscribe = () => {
  const { data: subscriptions, refetch } =
    trpc.subscription.byUserId.useQuery();

  const [searchFilter, setSearchFilter] = useState<string>();

  const { data: pitchers } = trpc.pitcher.byNameSearch.useQuery(
    searchFilter?.split(" ") || [],
    {
      enabled: !!searchFilter,
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

  // if (!user || !subscriptions) return null;

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
          const existingSubscription = subscriptions?.find(
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
                      pitcherId: pitcher.id,
                    });
                  }}
                >
                  <Text>Subscribe</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
