import { useTheme } from "@/src/contexts/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  const { colors, isDark } = useTheme();
  
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
       isDark ? "#334155" : "#E2E8F0", 
       colors.primary
    ],
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      className={`opacity-${disabled ? '50' : '100'}`}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={{
          width: 44,
          height: 24,
          borderRadius: 9999,
          justifyContent: "center",
          backgroundColor,
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 9999,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}

