import React from "react";
import { Pressable, PressableProps } from "react-native";
import { ClassInput } from "twrnc/dist/esm/types";
import tw from "../tailwind";

type Props = {
  style?: ClassInput;
} & PressableProps;

export default function ButtonContainer({
  children,
  style,
  onPress,
  disabled,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  accessibilityValue,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        tw.style(style, pressed ? "opacity-60" : "opacity-100")
      }
      accessibilityRole={accessibilityRole || "button"}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={
        accessibilityState || (disabled && { disabled }) || undefined
      }
      accessibilityValue={accessibilityValue}
    >
      {children}
    </Pressable>
  );
}

ButtonContainer.defaultProps = {
  style: undefined,
};
