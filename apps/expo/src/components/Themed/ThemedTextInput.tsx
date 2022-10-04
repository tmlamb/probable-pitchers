import React from "react";
import {
  ColorValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
} from "react-native";
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
  value?: string;
  className?: string;
  textInputClassName?: string;
  labelClassName?: string;
  label?: string;
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
  innerRef?: React.LegacyRef<NativeTextInput>;
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
  value,
  className,
  textInputClassName,
  labelClassName,
  label,
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
  innerRef,
  accessibilityLabel,
  testID,
}: PropsFilled) {
  const handleChange = (text: string) => {
    const normalizedText = spaceReplace(numeric ? numericReplace(text) : text);
    onChangeText(normalizedText);
  };

  return (
    <ThemedView className={`relative py-0 web:px-0 ${className}`}>
      <ThemedView
        className={"px-0 py-2 web:py-0 relative w-full bg-transparent"}
      >
        {label && (
          <SecondaryText
            className={`absolute leading-tight text-lg tracking-tight pl-0 web:pl-3
              ${labelClassName}`}
            accessible={false}
          >
            {label}
          </SecondaryText>
        )}
        <NativeTextInput
          onChangeText={handleChange}
          onChange={onChange}
          onBlur={onBlur}
          value={value ? nbspReplace(value) : value}
          className={`${primaryTextColor} 
            w-full pb-[2.8px] pt-[2.5px] android:py-[.15px] z-20 pr-0 text-lg web:text-right web:pr-3 web:pt-[10.75px] web:pb-[10.75px] leading-tight tracking-tight 
            ${textInputClassName}`}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || secondaryTextColor}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlign={label ? "right" : undefined}
          textAlignVertical="center"
          selectTextOnFocus={selectTextOnFocus}
          clearTextOnFocus={clearTextOnFocus}
          editable={editable}
          selection={selection}
          onKeyPress={onKeyPress}
          multiline
          numberOfLines={1}
          scrollEnabled={false}
          ref={innerRef}
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
  className: undefined,
  onChangeText: (text: string) => text,
  onChange: undefined,
  onBlur: undefined,
  textInputClassName: undefined,
  labelClassName: undefined,
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
