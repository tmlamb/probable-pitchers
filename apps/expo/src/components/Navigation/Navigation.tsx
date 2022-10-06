import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "next-auth/expo";
import React from "react";
import { Platform } from "react-native";
import { Home, Settings, Subscribe, Welcome } from "../../screens/";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { status } = useSession();

  return (
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
                title: "Edit Subscriptions",
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
