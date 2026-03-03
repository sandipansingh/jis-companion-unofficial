import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-base dark:bg-base">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-sm text-ink-600 dark:text-ink-400 tracking-wide font-sans">
        {message}
      </Text>
    </View>
  );
}
