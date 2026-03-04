import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface CustomTextInputProps extends TextInputProps {
  icon?: LucideIcon;
  iconColor?: string;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
  label?: string;
  error?: string;
  disableFocusStyle?: boolean;
}

export function TextInput({
  icon,
  iconColor,
  isPassword,
  showPasswordToggle = true,
  label,
  error,
  style,
  disableFocusStyle,
  ...props
}: CustomTextInputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    setIsFocused(true);
    if (!disableFocusStyle) {
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    props.onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    setIsFocused(false);
    if (!disableFocusStyle) {
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    props.onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.overlay, colors.textSecondary],
  });

  const IconComponent = icon;

  const Container = (Platform.OS === 'web' ? View : Animated.View) as any;
  const containerProps =
    Platform.OS === 'web'
      ? {
          style: {
            borderColor:
              isFocused && !disableFocusStyle ? colors.textSecondary : colors.overlay,
            borderWidth: isFocused && !disableFocusStyle ? 1.5 : 1,
            shadowColor:
              isFocused && !disableFocusStyle ? colors.textSecondary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused && !disableFocusStyle ? 0.14 : 0,
            shadowRadius: isFocused && !disableFocusStyle ? 6 : 0,
            elevation: isFocused && !disableFocusStyle ? 2 : 0,
          },
        }
      : {
          style: {
            borderColor: disableFocusStyle ? colors.overlay : borderColor,
            borderWidth: isFocused && !disableFocusStyle ? 1.5 : 1,
            shadowColor:
              isFocused && !disableFocusStyle ? colors.textSecondary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused && !disableFocusStyle ? 0.14 : 0,
            shadowRadius: isFocused && !disableFocusStyle ? 6 : 0,
            elevation: isFocused && !disableFocusStyle ? 2 : 0,
          },
        };

  return (
    <View className="w-full gap-1.5">
      {label && (
        <Text className="text-xs font-sans-semi text-ink-600 dark:text-ink-300 tracking-wide uppercase">
          {label}
        </Text>
      )}
      <Container
        {...containerProps}
        className="flex-row items-center bg-surface dark:bg-surface rounded-2xl px-4 h-14"
      >
        {IconComponent && (
          <IconComponent
            size={18}
            color={
              iconColor ||
              (isFocused && !disableFocusStyle
                ? colors.textSecondary
                : colors.textTertiary)
            }
            style={{ marginRight: 10 }}
          />
        )}
        <RNTextInput
          style={[
            {
              flex: 1,
              fontSize: 15,
              color: colors.text,
              fontFamily: 'Inter_400Regular',
              height: '100%',
            },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {isPassword && showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
          >
            {showPassword ? (
              <Eye size={18} color={colors.textTertiary} />
            ) : (
              <EyeOff size={18} color={colors.textTertiary} />
            )}
          </TouchableOpacity>
        )}
      </Container>
      {error && <Text className="text-xs text-danger font-sans mt-0.5">{error}</Text>}
    </View>
  );
}
