import { SafeAreaView, Text, View } from "react-native";

export const HomeScreen = () => {
  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-5xl font-bold mx-auto pb-2">
          Probable Pitchers
        </Text>
      </View>
    </SafeAreaView>
  );
};
