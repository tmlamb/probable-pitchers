import React from "react";
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
import { SpecialText, ThemedTextInput } from "./Themed";

type Props = {
  onChange: (text?: string) => void;
  style?: ClassInput;
};

export default function SearchInput({ onChange, style }: Props) {
  const [searchText, setSearchText] = React.useState<string>();
  const [showCancelButton, setShowCancelButton] = React.useState(false);
  const [searchComponentWidth, setSearchComponentWidth] =
    React.useState<number>(Dimensions.get("window").width);
  const [cancelButtonWidth, setCancelButtonWidth] = React.useState<number>(0);
  const searchFilterWidth = useSharedValue(searchComponentWidth);
  const searchFilterStyle = useAnimatedStyle(
    () => ({
      width: searchFilterWidth.value,
    }),
    [searchFilterWidth.value]
  );

  const searchComponentMarginTop = useSharedValue(0);
  const searchComponentMarginBottom = useSharedValue(36);
  const searchComponentStyle = useAnimatedStyle(
    () => ({
      marginTop: searchComponentMarginTop.value,
      marginBottom: searchComponentMarginBottom.value,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    [searchComponentMarginTop.value]
  );

  return (
    <Animated.View
      style={tw.style(
        `flex-row items-center justify-between w-full`,
        style,
        searchComponentStyle
      )}
      onLayout={(event) => {
        const roundedWidth = Math.round(event.nativeEvent.layout.width);
        if (roundedWidth !== searchComponentWidth) {
          setSearchComponentWidth(roundedWidth);
          searchFilterWidth.value = withTiming(
            roundedWidth - (searchText ? cancelButtonWidth : 0),
            { duration: 500 }
          );
        }
      }}
    >
      <Animated.View style={searchFilterStyle}>
        <ThemedTextInput
          onFocus={() => {
            searchFilterWidth.value = withTiming(
              searchComponentWidth - cancelButtonWidth,
              { duration: 500 }
            );
            searchComponentMarginTop.value = withTiming(-36, {
              duration: 500,
            });
            searchComponentMarginBottom.value = withTiming(24, {
              duration: 500,
            });
            setShowCancelButton(true);
            // searchFilterWidth.value = withTiming(
            //   searchComponentWidth - cancelButtonWidth,
            //   { duration: 500 }
            // );
            // searchComponentMarginTop.value = withTiming(0, { duration: 500 });
            // searchComponentMarginBottom.value = withTiming(36, {
            //   duration: 500,
            // });
          }}
          onBlur={() => {
            if (!searchText) {
              searchFilterWidth.value = withTiming(searchComponentWidth, {
                duration: 500,
              });
              searchComponentMarginTop.value = withTiming(0, {
                duration: 500,
              });
              searchComponentMarginBottom.value = withTiming(36, {
                duration: 500,
              });
              setShowCancelButton(false);
            }
            // searchFilterWidth.value = withTiming(
            //   searchComponentWidth - cancelButtonWidth,
            //   { duration: 500 }
            // );
            // searchComponentMarginTop.value = withTiming(0, { duration: 500 });
            // searchComponentMarginBottom.value = withTiming(36, {
            //   duration: 500,
            // });
          }}
          onChangeText={(text) => {
            onChange(text);
            setSearchText(text);
          }}
          value={searchText || ""}
          style={tw.style("rounded-xl")}
          label={searchText ? undefined : "Search"}
          accessibilityLabel="Filter list of pitchers by name"
        />
      </Animated.View>
      {showCancelButton && (
        <Animated.View
          entering={FadeInRight.delay(300)}
          exiting={FadeOutRight.duration(100)}
          onLayout={(event) => {
            const roundedWidth = Math.round(event.nativeEvent.layout.width);
            if (cancelButtonWidth !== roundedWidth) {
              setCancelButtonWidth(roundedWidth);
              searchFilterWidth.value = withTiming(
                searchComponentWidth - roundedWidth,
                {
                  duration: 500,
                }
              );
            }
          }}
        >
          <ButtonContainer
            onPress={() => {
              searchFilterWidth.value = withTiming(searchComponentWidth, {
                duration: 500,
              });
              searchComponentMarginTop.value = withTiming(0, {
                duration: 500,
              });
              searchComponentMarginBottom.value = withTiming(36, {
                duration: 500,
              });
              onChange(undefined);
              setSearchText(undefined);
              setShowCancelButton(false);
              Keyboard.dismiss();
            }}
            accessibilityLabel="Clear exercise filter"
          >
            <SpecialText style={tw`pl-2.5 text-lg tracking-tight`}>
              Cancel
            </SpecialText>
          </ButtonContainer>
        </Animated.View>
      )}
    </Animated.View>
  );
}
