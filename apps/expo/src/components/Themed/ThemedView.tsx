import React from "react";
import { AccessibilityState, View } from "react-native";
import { ClassInput } from "twrnc/dist/esm/types";
import tw from "../../tailwind";

type Props = {
  style?: ClassInput;
  children: React.ReactNode;
  rounded?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
};

export default function ThemedView({
  style,
  children,
  rounded,
  accessible,
  accessibilityLabel,
  accessibilityState,
}: Props) {
  return (
    <View
      style={tw.style(
        rounded ? "rounded-xl" : "rounded-none",
        "dark:bg-slate-800 dark:border-slate-700 border-slate-300 bg-slate-200 py-2 px-3 flex-row items-center justify-between",
        style
      )}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}

ThemedView.defaultProps = {
  style: undefined,
  rounded: false,
  accessible: false,
  accessibilityLabel: undefined,
  accessibilityState: undefined,
};
