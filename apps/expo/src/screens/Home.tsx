import { signOut } from "next-auth/expo";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import HeaderRightContainer from "../components/HeaderRightContainer";
import { RootStackScreenProps } from "../components/Navigation/types";
import { trpc } from "../components/TRPCProvider";

export const Home = ({
  navigation: { navigate },
}: RootStackScreenProps<"Home">) => {
  const { data: subscriptions } = trpc.subscription.byUserId.useQuery();

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
          {subscriptions?.map((sub) => (
            <View key={sub.id}>
              <Text>{sub.pitcher.name}</Text>
            </View>
          ))}
          <Pressable onPress={signOut}>
            <Text>Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
};
