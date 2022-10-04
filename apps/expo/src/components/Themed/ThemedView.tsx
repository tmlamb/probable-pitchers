import React from "react";
import { AccessibilityState, View } from "react-native";

type Props = {
  className?: string;
  children: React.ReactNode;
  rounded?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
};

export default function ThemedView({
  className,
  children,
  rounded,
  accessible,
  accessibilityLabel,
  accessibilityState,
}: Props) {
  return (
    <View
      className={`
        ${
          rounded ? "rounded-xl" : "rounded-none"
        } dark:bg-slate-800 dark:border-slate-700 border-slate-300 bg-slate-200 py-2 px-3 flex-row items-center justify-between ${className}
      `}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}

ThemedView.defaultProps = {
  className: undefined,
  rounded: false,
  accessible: false,
  accessibilityLabel: undefined,
  accessibilityState: undefined,
};
