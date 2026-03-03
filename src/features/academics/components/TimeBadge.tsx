import { Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface TimeBadgeProps {
  timeRange: string;
}

export function TimeBadge({ timeRange }: TimeBadgeProps) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-1.5 bg-cobalt-50 dark:bg-ink-800 border border-border rounded-full px-4 py-2">
      <Clock size={14} color={colors.primary} />
      <Text className="text-sm text-cobalt-600 dark:text-cobalt-300 font-sans-semi">
        {timeRange}
      </Text>
    </View>
  );
}
