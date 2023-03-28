import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Dimensions, Keyboard } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ClassInput } from "twrnc/dist/esm/types";
import tw from "../tailwind";
import ButtonContainer from "./ButtonContainer";
import { SecondaryText, SpecialText, ThemedTextInput } from "./Themed";
import { AppState } from "react-native";

type Props = {
  onChange: (text?: string) => void;
  onActive: () => void;
  onCancel: () => void;
  style?: ClassInput;
};

export default function SearchInput({ onChange, onActive, onCancel, style }: Props) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = React.useState<string>();
  const [showCancelButton, setShowCancelButton] = React.useState(false);
  const [searchComponentWidth, setSearchComponentWidth] =
    React.useState<number>(Dimensions.get("window").width);
  const [cancelButtonWidth, setCancelButtonWidth] = React.useState<number>(0);
  const searchFilterWidth = useSharedValue(searchComponentWidth - 24);
  const searchFilterStyle = useAnimatedStyle(
    () => ({
      width: searchFilterWidth.value,
    }),
    [searchFilterWidth.value]
  );

  const searchComponentMarginTop = useSharedValue(0);
  const searchComponentStyle = useAnimatedStyle(
    () => ({
      marginTop: searchComponentMarginTop.value,
      marginBottom: 12,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    [searchComponentMarginTop.value]
  );

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        searchFilterWidth.value = withTiming(searchComponentWidth, {
          duration: 50,
        });
        searchComponentMarginTop.value = withTiming(0, {
          duration: 50,
        });
        onChange(undefined);
        setSearchText(undefined);
        setShowCancelButton(false);
        navigation.setOptions({
          headerShown: true,
        });
        onCancel();
        Keyboard.dismiss();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <Animated.View
      style={tw.style("mb-9", style, searchComponentStyle)}
      onLayout={(event) => {
        const roundedWidth = Math.round(event.nativeEvent.layout.width);
        if (roundedWidth !== searchComponentWidth) {
          setSearchComponentWidth(roundedWidth);
          searchFilterWidth.value = withTiming(
            roundedWidth - (searchText ? cancelButtonWidth : 0),
            { duration: 250 }
          );
        }
      }}
    >
      <Animated.View style={searchFilterStyle}>
        <ThemedTextInput
          onFocus={() => {
            searchFilterWidth.value = withTiming(
              searchComponentWidth - cancelButtonWidth,
              { duration: 250 }
            );
            searchComponentMarginTop.value = withTiming(-24, {
              duration: 250,
            });
            setShowCancelButton(true);
            navigation.setOptions({
              headerShown: false,
            });
            onActive();
          }}
          onBlur={() => {
            if (!searchText) {
              searchFilterWidth.value = withTiming(searchComponentWidth, {
                duration: 250,
              });
              searchComponentMarginTop.value = withTiming(0, {
                duration: 250,
              });
              setShowCancelButton(false);
              navigation.setOptions({
                headerShown: true,
              });
              onCancel();
            }
          }}
          onChangeText={(text) => {
            onChange(text);
            setSearchText(text);
          }}
          value={searchText || ""}
          style={tw.style("rounded-xl px-3")}
          leftIcon={<>
            <SecondaryText style={tw`-ml-1.5 mr-1.5`}>
              <AntDesign name="search1" size={18} />
            </SecondaryText>
          </>}
          placeholder="Search"
          accessibilityLabel="Filter list of pitchers by name"
        />
      </Animated.View>
      {showCancelButton && (
        <Animated.View
          entering={FadeInRight.delay(0)}
          exiting={FadeOutRight.duration(100)}
          onLayout={(event) => {
            const roundedWidth = Math.round(event.nativeEvent.layout.width);
            if (cancelButtonWidth !== roundedWidth) {
              setCancelButtonWidth(roundedWidth);
              searchFilterWidth.value = withTiming(
                searchComponentWidth - roundedWidth,
                {
                  duration: 250,
                }
              );
            }
          }}
        >
          <ButtonContainer
            onPress={() => {
              searchFilterWidth.value = withTiming(searchComponentWidth, {
                duration: 250,
              });
              searchComponentMarginTop.value = withTiming(0, {
                duration: 250,
              });
              onChange(undefined);
              setSearchText(undefined);
              setShowCancelButton(false);
              navigation.setOptions({
                headerShown: true,
              });
              onCancel();
              Keyboard.dismiss();
            }}
            accessibilityLabel="Clear exercise filter"
          >
            <SpecialText style={tw`pl-3 font-bold text-lg tracking-tight`}>
              Done
            </SpecialText>
          </ButtonContainer>
        </Animated.View>
      )}
    </Animated.View>
  );
}
