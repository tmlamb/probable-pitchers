import React from "react";
import {
  ColorValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ClassInput } from "twrnc/dist/esm/types";
import tw from "../../tailwind";
import {
  primaryTextColor,
  SecondaryText,
  secondaryTextColor,
} from "./ThemedText";
import ThemedView from "./ThemedView";

type Props = {
  onChangeText?: (text: string) => void;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onBlur?: (e: unknown) => void;
  onFocus?: (e: unknown) => void;
  value?: string;
  style?: ViewStyle;
  textInputStyle?: ClassInput;
  labelStyle?: ClassInput;
  label?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  maxLength?: number;
  selectTextOnFocus?: boolean;
  clearTextOnFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  numeric?: boolean;
  editable?: boolean;
  selection?: { start: number; end?: number };
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  accessibilityLabel?: string;
  testID?: string;
};

// When text in an input is right justifed, any trailing whitespace in the field gets treated
// as space to be removed so that the text is right aligned. This causes spaces to be ignored
// visually until a non-whitespace character is entered. &nbsp; (\u00a0) does not behave this
// way, so swapping them in for the input's value fixes the issue.
const nbspReplace = (str: string) => str.replace(/\u0020/g, "\u00a0");
const spaceReplace = (str: string) => str.replace(/\u00a0/g, "\u0020");

// Prevents non-numeric values in numeric fields and trims leading zeros.
const numericReplace = (str: string) =>
  str.replace(/[^0-9|\\.]/g, "").replace(/^0+/g, "");

interface PropsFilled extends Props {
  onChangeText: (text: string) => void;
  keyboardType: KeyboardTypeOptions;
}

export default function TextInput({
  onChangeText,
  onChange,
  onBlur,
  onFocus,
  value,
  style,
  textInputStyle,
  labelStyle,
  label,
  leftIcon,
  placeholder,
  placeholderTextColor,
  maxLength,
  selectTextOnFocus,
  clearTextOnFocus,
  keyboardType,
  numeric,
  editable,
  selection,
  onKeyPress,
  accessibilityLabel,
  testID,
}: PropsFilled) {
  const handleChange = (text: string) => {
    const normalizedText = spaceReplace(numeric ? numericReplace(text) : text);
    onChangeText(normalizedText);
  };

  return (
    <ThemedView style={tw.style("relative py-0", style)}>
      <ThemedView style={tw`px-0 py-1.5 relative w-full bg-transparent`}>
        {leftIcon || label && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={tw`absolute`}
          >
            <>
              {leftIcon && (
                { leftIcon }
              )}
              {label && (
                <SecondaryText
                  style={tw.style(
                    "leading-tight text-lg tracking-tight pl-0",
                    labelStyle
                  )}
                  accessible={false}
                >
                  {label}
                </SecondaryText>
              )}
            </>
          </Animated.View>
        )}
        {label && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={tw`absolute`}
          >
          </Animated.View>
        )}
        <NativeTextInput
          onChangeText={handleChange}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value ? nbspReplace(value) : value}
          style={tw.style(
            primaryTextColor,
            "w-full pb-[2.8px] pt-[2.5px] android:py-[.15px] z-20 pr-0 text-lg leading-tight tracking-normal",
            textInputStyle
          )}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor || tw.color(secondaryTextColor)
          }
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlign={"left"}
          textAlignVertical="center"
          selectTextOnFocus={selectTextOnFocus}
          clearTextOnFocus={clearTextOnFocus}
          editable={editable}
          selection={selection}
          onKeyPress={onKeyPress}
          multiline
          numberOfLines={1}
          scrollEnabled={false}
          blurOnSubmit
          accessibilityLabel={accessibilityLabel || label}
          testID={testID}
        />
      </ThemedView>
    </ThemedView>
  );
}

TextInput.defaultProps = {
  value: undefined,
  style: undefined,
  onChangeText: (text: string) => text,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
  textInputStyle: undefined,
  labelStyle: undefined,
  maxLength: undefined,
  label: undefined,
  placeholder: undefined,
  placeholderTextColor: undefined,
  selectTextOnFocus: false,
  clearTextOnFocus: false,
  numeric: false,
  keyboardType: "default",
  editable: true,
  selection: undefined,
  onKeyPress: undefined,
  innerRef: undefined,
  accessibilityLabel: undefined,
  testID: undefined,
};
