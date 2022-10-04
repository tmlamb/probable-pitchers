import { NavigationAction, useLinkProps } from "@react-navigation/native";
import { To } from "@react-navigation/native/lib/typescript/src/useLinkTo";
import React from "react";
import { PressableProps } from "react-native";
import ButtonContainer from "./ButtonContainer";
import { RootStackParamList } from "./Navigation";

type Props = {
  to: To<RootStackParamList>;
  action?: NavigationAction;
  children: JSX.Element | JSX.Element[];
  onPress?: () => void;
  className?: string;
  beforeNavigation?: () => void;
} & PressableProps;

export default function LinkButton({
  to,
  action,
  children,
  onPress,
  className,
  beforeNavigation,
  disabled,
  accessibilityHint,
  accessibilityLabel,
  accessibilityValue,
}: Props) {
  const { onPress: navigate } = useLinkProps<RootStackParamList>({
    to,
    action,
  });

  return (
    <ButtonContainer
      className={className}
      onPress={(e) => {
        onPress?.();
        if (disabled) {
          return;
        }
        beforeNavigation?.();
        navigate(e);
      }}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={(disabled && { disabled }) || undefined}
      accessibilityValue={accessibilityValue}
    >
      {children}
    </ButtonContainer>
  );
}

LinkButton.defaultProps = {
  action: undefined,
  className: undefined,
  onPress: undefined,
  beforeNavigation: () => null,
};
