import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "next-auth/expo";
import { Platform, Text } from "react-native";
import "react-native-get-random-values";
import { Home, Subscribe, Welcome } from "../../screens/";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { status, data } = useSession();

  return status === "loading" ? (
    <Text>Loading...</Text>
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
                headerTitle: "",
                title: "Probable Pitchers",
              }}
            />
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
