import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  message: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export function EmptyState({ message, icon: Icon }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-base px-8">
      {Icon && (
        <View className="w-20 h-20 rounded-3xl bg-ink-200 items-center justify-center">
          <Icon size={36} color={colors.textTertiary} />
        </View>
      )}
      <Text className="text-base text-ink-600 text-center leading-6 font-sans">
        {message}
      </Text>
    </View>
  );
}
