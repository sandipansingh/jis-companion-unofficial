import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface WeekNavigatorProps {
  weekPeriod: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function WeekNavigator({ weekPeriod, onPrevious, onNext }: WeekNavigatorProps) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-between py-3 px-1 mb-1">
      <TouchableOpacity
        onPress={onPrevious}
        activeOpacity={0.7}
        className="w-8 h-8 rounded-xl bg-ink-100 dark:bg-ink-800 items-center justify-center"
      >
        <ChevronLeft size={18} color={colors.textTertiary} />
      </TouchableOpacity>
      <Text className="text-sm text-ink-600 dark:text-ink-400 font-sans-md">
        {weekPeriod}
      </Text>
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.7}
        className="w-8 h-8 rounded-xl bg-ink-100 dark:bg-ink-800 items-center justify-center"
      >
        <ChevronRight size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}
