import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform, View } from "react-native";
import { Welcome } from "../../screens/";
import tw from "../../tailwind";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <View style={tw`flex-1 bg-slate-50 dark:bg-black`}>
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerBackTitleVisible: Platform.OS !== "android",
            headerTitleAlign: "center",
          }}
        >
          <AppStack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerTitle: "",
              presentation: "modal",
              animation: "fade",
            }}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    </View>
  );
}
