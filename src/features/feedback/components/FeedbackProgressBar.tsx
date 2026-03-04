import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface FeedbackProgressBarProps {
  progressPercentage: number;
  submittedCount: number;
  pendingCount: number;
  notOptedCount: number;
  totalCount: number;
}

/**
 * A horizontal progress bar showing feedback completion status.
 * Used on the desktop web layout of FacultyListScreen.
 */
export function FeedbackProgressBar({
  progressPercentage,
  submittedCount,
  pendingCount,
  notOptedCount,
  totalCount,
}: FeedbackProgressBarProps) {
  const { colors } = useTheme();
  const clampedProgress = Math.min(Math.max(progressPercentage, 0), 100);

  return (
    <View className="rounded-[14px] border border-border p-[18px] mb-6 flex-row items-center gap-6 bg-surface">
      <View>
        <Text
          className="text-[28px] leading-8 font-sans-bold"
          style={{ color: colors.text }}
        >
          {progressPercentage}
          <Text className="text-base font-sans" style={{ color: colors.textSecondary }}>
            %
          </Text>
        </Text>
        <Text
          className="text-[11px] mt-0.5 font-sans"
          style={{ color: colors.textSecondary }}
        >
          completed
        </Text>
      </View>
      <View className="flex-1">
        <View
          className="h-1.5 rounded-[3px] overflow-hidden mb-2.5 bg-border"
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, now: clampedProgress, max: 100 }}
        >
          <View
            className="h-full rounded-[3px]"
            style={{
              backgroundColor: colors.textSecondary,
              width: `${clampedProgress}%`,
            }}
          />
        </View>
        <View className="flex-row gap-4">
          <Text className="text-[11px] font-sans" style={{ color: colors.success }}>
            {submittedCount} done
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.warning }}>
            {pendingCount} pending
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.textSecondary }}>
            {notOptedCount} skipped
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.textSecondary }}>
            {totalCount} total
          </Text>
        </View>
      </View>
    </View>
  );
}
