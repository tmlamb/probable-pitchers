import React from "react";
import { AccessibilityRole, Text } from "react-native";
import { ClassInput } from "twrnc/dist/esm/types";
import tw from "../../tailwind";

export const primaryTextColor = "text-slate-900 dark:text-white";
export const secondaryTextColor = "text-slate-500 dark:text-slate-400";
export const specialTextColor = "text-sky-600 dark:text-sky-400";
export const alertTextColor = "text-red-500 dark:text-red-400";

type CommonProps = {
  children: React.ReactNode;
  style?: ClassInput;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
};

export function PrimaryText({
  children,
  style,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style(primaryTextColor, "text-lg", style)}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function SecondaryText({
  children,
  style,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style(secondaryTextColor, "text-lg", style)}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function SpecialText({
  children,
  style,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style(specialTextColor, "text-lg", style)}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function AlertText({
  children,
  style,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style(alertTextColor, "text-lg", style)}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

PrimaryText.defaultProps = {
  style: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
SecondaryText.defaultProps = {
  style: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
SpecialText.defaultProps = {
  style: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
AlertText.defaultProps = {
  style: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
