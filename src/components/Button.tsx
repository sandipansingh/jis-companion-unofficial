import React from 'react';
import {
  ActivityIndicator,
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: TextStyle;
  textClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  textClassName,
  icon,
  iconPosition = 'left',
  size = 'md',
  className,
  ...props
}: ButtonProps & { className?: string }) {
  const isDisabled = disabled || loading;
  const { colors } = useTheme();

  const containerBase =
    size === 'sm'
      ? 'h-10 rounded-xl px-5'
      : size === 'lg'
        ? 'h-[58px] rounded-2xl px-8'
        : 'h-14 rounded-2xl px-6';

  const widthClass = fullWidth ? 'w-full' : 'self-start';
  const opacityClass = isDisabled ? 'opacity-40' : '';

  const variantClass =
    variant === 'secondary'
      ? 'bg-transparent'
      : variant === 'ghost'
        ? 'bg-transparent'
        : variant === 'danger'
          ? 'bg-danger'
          : '';

  const variantStyle =
    variant === 'primary'
      ? {
          backgroundColor: colors.cta,
          borderWidth: 1,
          borderColor: colors.cta,
        }
      : variant === 'secondary'
        ? {
            borderWidth: 1,
            borderColor: colors.border,
          }
        : undefined;

  const spinnerColor =
    variant === 'primary' || variant === 'danger'
      ? (colors.onCta ?? colors.textInverse)
      : variant === 'ghost'
        ? colors.cta
        : colors.textSecondary;

  const textClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  const textColorClass = variant === 'danger' ? 'text-white' : '';
  const textColorStyle = {
    color:
      variant === 'primary' || variant === 'danger'
        ? (colors.onCta ?? colors.textInverse)
        : variant === 'ghost'
          ? colors.cta
          : colors.text,
  };

  return (
    <TouchableOpacity
      className={`${containerBase} ${widthClass} ${variantClass} ${opacityClass} items-center justify-center ${className || ''}`}
      style={[variantStyle, style]}
      disabled={isDisabled}
      activeOpacity={0.82}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === 'left' && icon}
          <RNText
            className={`${textClass} ${textColorClass} font-sans-semi ${textClassName || ''}`}
            style={[textColorStyle, textStyle]}
          >
            {title}
          </RNText>
          {icon && iconPosition === 'right' && icon}
        </View>
      )}
    </TouchableOpacity>
  );
}
