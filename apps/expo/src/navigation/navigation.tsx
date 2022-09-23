import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform } from "react-native";
import "react-native-get-random-values";
import useDeviceStore from "../hooks/use-device-store";
import { Home } from "../screens/home";
import { Subscribe } from "../screens/subscribe";
import { Welcome } from "../screens/welcome";
import { RootStackParamList } from "./types";

const AppStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  // const [isLoading, setLoading] = useState(true);
  // const [deviceId, setDeviceId] = useState<string | undefined>();
  // useEffect(() => {
  //   async function getDeviceId() {
  //     let deviceId = await SecureStore.getItemAsync("secure_deviceId");
  //     if (!deviceId) {
  //       deviceId = uuidv4();
  //       await SecureStore.setItemAsync("secure_deviceId", deviceId);
  //     }
  //     console.log("deviceId", deviceId);
  //     setDeviceId(deviceId);
  //     // setLoading(false);
  //   }
  //   getDeviceId();
  // }, []);
  // // console.log("deviceId rendered", deviceId);
  // const user = trpc.user.byDeviceId.useQuery(deviceId);

  // if (!deviceId) return null;

  const isFirstLaunch = useDeviceStore((store) => store.isFirstLaunch);

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerBackTitleVisible: Platform.OS !== "android",
          headerTitleAlign: "center",
        }}
      >
        {!isFirstLaunch ? (
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
        ) : (
          <AppStack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerTitle: "",
            }}
          />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
