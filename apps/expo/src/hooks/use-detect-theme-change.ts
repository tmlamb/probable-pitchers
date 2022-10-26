import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Appearance, AppState } from "react-native";

export const useDetectThemeChange = () => {
  const [forceRenderKey, setForceRenderKey] = useState(0);
  const colorScheme = useRef(Appearance.getColorScheme());

  const handleColorSchemeChange = () => {
    const systemColorScheme = Appearance.getColorScheme();
    if (colorScheme.current !== systemColorScheme) {
      setForceRenderKey((v: number) => v + 1);
      colorScheme.current = systemColorScheme;
    }
  };

  useFocusEffect(React.useCallback(handleColorSchemeChange, []));

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        handleColorSchemeChange();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, []);

  return forceRenderKey;
};
