import { TouchableOpacity } from 'react-native';

import { Text, View } from '@/src/components';

type AttendanceStatus = 'present' | 'absent' | 'partial' | 'holiday';

interface DateCardProps {
  dayLabel: string;
  date: number;
  status: AttendanceStatus;
  isSelected: boolean;
  isToday: boolean;
  classInfo?: string;
  onPress: () => void;
}

export function DateCard({
  dayLabel,
  date,
  status,
  isSelected,
  isToday,
  classInfo,
  onPress,
}: DateCardProps) {
  return (
    <TouchableOpacity className="flex-1 items-center gap-2" onPress={onPress}>
      <Text className="text-[11px] font-semibold uppercase text-ink-500 dark:text-ink-400">
        {dayLabel}
      </Text>
      <View
        className={`w-10 h-10 rounded-full items-center justify-center bg-transparent ${
          status === 'present' ? 'bg-success' : ''
        } ${status === 'absent' ? 'bg-red-500' : ''} ${
          status === 'partial' ? 'bg-warning' : ''
        } ${status === 'holiday' ? 'bg-gray-200 dark:bg-ink-800' : ''} ${
          isSelected ? 'border-2 border-info' : ''
        } ${isToday ? 'border-2 border-cobalt-500' : ''}`}
      >
        <Text
          className={`text-base font-semibold text-ink-500 dark:text-ink-400 ${
            status === 'present' || status === 'absent' || status === 'partial'
              ? 'text-white'
              : ''
          } ${status === 'holiday' ? 'text-ink-500 dark:text-ink-400' : ''} ${
            isSelected ? 'font-bold' : ''
          }`}
        >
          {date}
        </Text>
      </View>
      {classInfo && (
        <Text className="text-[10px] font-medium text-ink-500 dark:text-ink-400">
          {classInfo}
        </Text>
      )}
    </TouchableOpacity>
  );
}
