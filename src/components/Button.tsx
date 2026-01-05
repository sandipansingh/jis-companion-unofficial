import { Text } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled || loading) return colors.buttonDisabled;
    switch (variant) {
      case "secondary":
        return colors.accent;
      case "danger":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          width: fullWidth ? "100%" : "auto",
        },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.buttonText} />
      ) : (
        <Text style={[styles.text, { color: colors.buttonText }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
