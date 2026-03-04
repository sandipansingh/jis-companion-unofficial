import React, { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

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
  }, [value, animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? colors.overlay : colors.border, colors.cta],
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      className={disabled ? 'opacity-50' : ''}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
