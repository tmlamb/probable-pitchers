import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "next-auth/expo";
import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import "react-native-get-random-values";
import { Home, Settings, Subscribe, Welcome } from "../../screens/";
import tw from "../../tailwind";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { status, data } = useSession();

  return status === "loading" ? (
    <View style={tw`h-full w-full justify-center`}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerBackTitleVisible: Platform.OS !== "android",
          headerTitleAlign: "center",
        }}
      >
        {status === "unauthenticated" ? (
          <AppStack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerTitle: "",
              presentation: "modal",
            }}
          />
        ) : (
          <>
            <AppStack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: "",
                title: "Probable Pitchers",
              }}
            />
            <AppStack.Screen
              name="Subscribe"
              component={Subscribe}
              options={{
                title: "Add Subscription",
                headerBackTitle: "Home",
              }}
            />
            <AppStack.Screen
              name="Settings"
              component={Settings}
              options={{
                title: "Settings",
                headerBackTitle: "Home",
                animation: "fade_from_bottom",
              }}
            />
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
