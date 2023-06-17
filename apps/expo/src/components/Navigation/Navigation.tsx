import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "next-auth/expo";
import React from "react";
import { Platform, View } from "react-native";
import {
  Account,
  Notifications,
  Settings,
  Subscriptions,
  Support,
  Welcome,
} from "../../screens/";
import tw from "../../tailwind";
import { trpc } from "../TRPCProvider";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { status } = useSession();
  const trpcContext = trpc.useContext();

  if (status === "authenticated") {
    trpcContext.subscription.byUserId.prefetch();
    trpcContext.account.byUserId.prefetch();
  }

  return (
    <View style={tw`flex-1 bg-slate-50 dark:bg-black`}>
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
                animation: "fade",
              }}
            />
          )}
          {status !== "unauthenticated" && (
            <>
              <AppStack.Screen
                name="Subscriptions"
                component={Subscriptions}
                options={{
                  headerTitle: "",
                  title: "Probable Pitcher",
                }}
              />
              <AppStack.Screen
                name="Settings"
                component={Settings}
                options={{
                  title: "Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Account"
                component={Account}
                options={{
                  title: "Account Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                  title: "Notification Settings",
                  headerBackTitle: "Back",
                }}
              />
              <AppStack.Screen
                name="Support"
                component={Support}
                options={{
                  title: "Support",
                  headerBackTitle: "Back",
                }}
              />
            </>
          )}
        </AppStack.Navigator>
      </NavigationContainer>
    </View>
  );
}
