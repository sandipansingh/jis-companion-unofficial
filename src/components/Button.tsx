import React from "react";
import {
  ActivityIndicator,
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  icon,
  iconPosition = "left",
  size = "md",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerBase =
    size === "sm" ? "h-10 rounded-xl px-5" :
    size === "lg" ? "h-[58px] rounded-2xl px-8" :
    "h-14 rounded-2xl px-6";

  const widthClass = fullWidth ? "w-full" : "self-start";
  const opacityClass = isDisabled ? "opacity-40" : "";

  const variantClass =
    variant === "secondary"
      ? "bg-cobalt-50 border border-cobalt-200"
      : variant === "ghost"
      ? "bg-transparent"
      : variant === "danger"
      ? "bg-danger"
      : "bg-cobalt-500";

  const spinnerColor =
    variant === "primary" || variant === "danger" ? "#fff" : "#2B5BDB";

  const textClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  const textColorClass =
    variant === "secondary"
      ? "text-cobalt-600"
      : variant === "ghost"
      ? "text-cobalt-500"
      : "text-white";

  return (
    <TouchableOpacity
      className={`${containerBase} ${widthClass} ${variantClass} ${opacityClass} items-center justify-center`}
      style={style}
      disabled={isDisabled}
      activeOpacity={0.82}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === "left" && icon}
          <RNText
            className={`${textClass} ${textColorClass} font-sans-semi`}
            style={textStyle}
          >
            {title}
          </RNText>
          {icon && iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
}
