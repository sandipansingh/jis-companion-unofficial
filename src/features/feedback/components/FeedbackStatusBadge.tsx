import { CheckCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface FeedbackStatusBadgeProps {
  totalRating: number;
}

export function FeedbackStatusBadge({ totalRating }: FeedbackStatusBadgeProps) {
  const { colors } = useTheme();
  if (totalRating === -10) {
    return (
      <View className="bg-ink-100 rounded-full px-2.5 py-1">
        <Text className="text-[11px] text-ink-500 font-sans-semi">Skipped</Text>
      </View>
    );
  }

  if (totalRating > 0) {
    return (
      <View className="bg-success-light rounded-full flex-row items-center gap-1 px-2.5 py-1">
        <Text className="text-[11px] text-green-800 font-sans-semi">Done</Text>
        <CheckCircle size={11} color={colors.successText} />
      </View>
    );
  }

  return (
    <View className="bg-warning-light rounded-full px-2.5 py-1">
      <Text className="text-[11px] text-yellow-700 font-sans-semi">Pending</Text>
    </View>
  );
}
