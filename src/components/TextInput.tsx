import { useTheme } from "@/src/contexts/ThemeContext";
import { Eye, EyeOff, LucideIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  icon?: LucideIcon;
  isPassword?: boolean;
  bgColor?: string;
}

export function TextInput({
  icon,
  isPassword,
  bgColor,
  style,
  ...props
}: CustomTextInputProps) {
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useState(new Animated.Value(0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.inputBorder, colors.primary],
  });

  const IconComponent = icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor || colors.inputBackground,
          borderColor: animatedBorderColor,
        },
      ]}
    >
      {IconComponent && (
        <IconComponent
          size={20}
          color={isFocused ? colors.primary : colors.textMuted}
          style={styles.icon}
        />
      )}
      <RNTextInput
        style={[
          styles.input,
          { color: colors.text, flex: 1 },
          Platform.OS === "web" && ({ outlineStyle: "none" } as any),
          style,
        ]}
        placeholderTextColor={colors.inputPlaceholder}
        secureTextEntry={isPassword && !showPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          {showPassword ? (
            <Eye size={20} color={colors.textMuted} />
          ) : (
            <EyeOff size={20} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    height: "100%",
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
});
