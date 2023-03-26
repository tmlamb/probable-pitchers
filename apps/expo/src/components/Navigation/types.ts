import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Subscriptions: undefined;
  Welcome: undefined;
  Settings: undefined;
  Account: undefined;
  Notifications: undefined;
  Support: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
