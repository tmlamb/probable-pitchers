import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import tw from "../tailwind";

type Props = {
  children: React.ReactNode;
};

export default function HeaderLeftContainer({ children }: Props) {
  const memoizedComponent = React.useMemo(
    () => <View style={tw`web:ml-3`}>{children}</View>,
    [children]
  );
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => memoizedComponent,
    });
  }, [memoizedComponent, navigation]);

  return null;
}
