import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Subscribe: undefined;
  Welcome: undefined;
  Settings: undefined;
  Loading: undefined;
  Account: undefined;
  Notifications: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
