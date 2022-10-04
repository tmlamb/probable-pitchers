import React from "react";
import { Pressable, PressableProps } from "react-native";

type Props = {
  className?: string;
} & PressableProps;

export default function ButtonContainer({
  children,
  className,
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
      className={`${className} active:opacity-60 opacity-100`}
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
  className: undefined,
};
