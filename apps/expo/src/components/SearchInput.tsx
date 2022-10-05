import React from "react";
import { Keyboard, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import tw from "../tailwind";
import ButtonContainer from "./ButtonContainer";
import { SpecialText, ThemedTextInput } from "./Themed";

type Props = {
  onChange: (text?: string) => void;
};

export default function SearchInput({ onChange }: Props) {
  const [searchText, setSearchText] = React.useState<string>();
  const [showCancelButton, setShowCancelButton] = React.useState(false);
  const [searchComponentWidth, setSearchComponentWidth] =
    React.useState<number>(0);
  const [cancelButtonWidth, setCancelButtonWidth] = React.useState<number>(0);
  const searchFilterWidth = useSharedValue(searchComponentWidth);
  const searchFilterStyle = useAnimatedStyle(
    () => ({
      width: searchFilterWidth.value,
    }),
    [searchFilterWidth.value]
  );

  return (
    <View
      style={tw`flex-row items-center justify-between w-full mb-9`}
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
          onChangeText={(text) => {
            searchFilterWidth.value = withTiming(
              text?.length > 0
                ? searchComponentWidth - cancelButtonWidth
                : searchComponentWidth,
              { duration: 500 }
            );
            setShowCancelButton(text?.length > 0);
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
    </View>
  );
}
