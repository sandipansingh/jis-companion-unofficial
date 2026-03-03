import { User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { parseSubjectName } from '@/src/utils/stringHelpers';

import { SubjectWiseAttendance } from '../types';
import { getAttendanceStatus } from '../utils/attendanceHelpers';

interface RoutineTimelineItemProps {
  classItem: SubjectWiseAttendance;
  time: string;
  isLast: boolean;
  onPress?: () => void;
}

export function RoutineTimelineItem({
  classItem,
  time,
  isLast,
  onPress,
}: RoutineTimelineItemProps) {
  const { colors } = useTheme();
  const statValue = getAttendanceStatus(classItem);
  const isPresent = statValue?.toLowerCase() === 'present';
  const hasStatus = statValue && statValue !== 'Not Yet Available';

  const accentColor = hasStatus
    ? isPresent
      ? colors.success
      : colors.danger
    : colors.textSecondary;

  return (
    <View className="flex-row mb-3">
      <View className="w-[68px] items-center pt-3 gap-1">
        <Text className="text-xs text-ink-600 dark:text-ink-400 mb-2 font-sans-md">
          {time}
        </Text>
        <View className="items-center flex-1">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          {!isLast && (
            <View className="w-[1.5px] flex-1 bg-ink-200 dark:bg-ink-800 mt-1 min-h-[20px]" />
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.75}
        className={`flex-1 bg-surface dark:bg-surface rounded-2xl overflow-hidden mb-4 border border-border border-l-[3px] ${
          !onPress ? 'opacity-80' : ''
        }`}
        style={{
          borderLeftColor: accentColor,
        }}
      >
        <View className="px-4 py-3">
          <Text
            className="text-sm text-ink-900 dark:text-white leading-tight font-sans-semi"
            numberOfLines={2}
          >
            {parseSubjectName(classItem.subject_name).name}
          </Text>
          {classItem.faculty && (
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <User size={11} color={colors.textTertiary} />
              <Text
                className="text-xs text-ink-500 dark:text-ink-400 font-sans"
                numberOfLines={1}
              >
                {classItem.faculty}
              </Text>
            </View>
          )}
          {hasStatus && (
            <View
              className={`self-start rounded-full px-2 py-0.5 mt-1.5 ${
                isPresent
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <Text
                className="text-[10px] font-sans-semi"
                style={{
                  color: isPresent ? colors.success : colors.danger,
                }}
              >
                {isPresent ? 'Present' : 'Absent'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
