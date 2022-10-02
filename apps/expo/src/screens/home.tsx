import { signOut, useSession } from "next-auth/expo";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import HeaderRightContainer from "../navigation/headerRightContainer";
import { RootStackScreenProps } from "../navigation/types";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const { status, data } = useSession();
  // const { signOut } = useAuthStore((store) => store);
  // const deviceId = useDeviceStore((store) => store.deviceId);
  // const { data: user } = trpc.user.byDeviceId.useQuery(deviceId);

  // const { data: subscriptions } =
  //   trpc.subscription.byUserIdWithPitcher.useQuery(user?.id ?? -1, {
  //     enabled: !!user,
  //   });

  return (
    <>
      <HeaderRightContainer>
        <Pressable
          onPress={() => {
            navigate("Subscribe");
          }}
        >
          <Text>+</Text>
        </Pressable>
      </HeaderRightContainer>
      <SafeAreaView>
        <View className="h-full w-full p-4">
          <Text className="text-5xl font-bold mx-auto pb-2">
            Probable Pitchers
          </Text>
          <Text>Logged in as {data?.user?.name}</Text>
          {/* {subscriptions?.map((sub) => (
            <View key={sub.id}>
            <View key={sub.id}>
              <Text>{sub.pitcher.name}</Text>
            </View>
          ))} */}
          <Pressable onPress={signOut}>
            <Text>Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
};
