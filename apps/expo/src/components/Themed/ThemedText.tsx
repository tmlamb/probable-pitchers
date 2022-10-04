import React from "react";
import { AccessibilityRole, Text } from "react-native";

export const primaryTextColor = "text-slate-900 dark:text-white";
export const secondaryTextColor = "text-slate-500 dark:text-slate-400";
export const specialTextColor = "text-sky-600 dark:text-sky-400";
export const alertTextColor = "text-red-500 dark:text-red-400";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
};

export function PrimaryText({
  children,
  className,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${primaryTextColor} 'text-lg' ${className}`}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function SecondaryText({
  children,
  className,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${secondaryTextColor} 'text-lg' ${className}`}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function SpecialText({
  children,
  className,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${specialTextColor} 'text-lg' ${className}`}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

export function AlertText({
  children,
  className,
  numberOfLines,
  accessibilityRole,
  accessible,
}: CommonProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${alertTextColor} 'text-lg' ${className}`}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}

PrimaryText.defaultProps = {
  className: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
SecondaryText.defaultProps = {
  className: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
SpecialText.defaultProps = {
  className: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
AlertText.defaultProps = {
  className: undefined,
  numberOfLines: undefined,
  accessibilityRole: undefined,
  accessible: true,
};
