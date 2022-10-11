import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "next-auth/expo";
import React from "react";
import { Platform } from "react-native";
import { Home, Settings, Subscribe, Welcome } from "../../screens/";
import { Loading } from "../../screens/Loading";
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
        {status === "unauthenticated" && (
          <AppStack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerTitle: "",
              presentation: "modal",
            }}
          />
        )}
        {status === "authenticated" && (
          <>
            <AppStack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: "",
                title: "Probable Pitcher",
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
        {status === "loading" && (
          <AppStack.Screen
            name="Loading"
            component={Loading}
            options={{
              headerTitle: "",
            }}
          />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
