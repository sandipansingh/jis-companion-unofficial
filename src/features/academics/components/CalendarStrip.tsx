import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { getDayName, isSameDay } from '@/src/utils/dateHelpers';

type AttendanceStatus = 'present' | 'absent' | 'partial' | 'holiday';

interface AttendanceData {
  rtDate: string;
  rtCount: number;
  rtPresent: number;
  _isFallback?: boolean;
}

interface CalendarStripProps {
  weekDates: Date[];
  selectedDate: Date;
  onDatePress: (date: Date) => void;
  getAttendanceStatus: (date: Date) => AttendanceStatus;
  getAttendanceWithFallback: (date: Date) => AttendanceData | null | undefined;
}

export function CalendarStrip({
  weekDates,
  selectedDate,
  onDatePress,
  getAttendanceStatus,
  getAttendanceWithFallback,
}: CalendarStripProps) {
  const { isDark, colors } = useTheme();

  const getStatusStyles = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return {
          bg: colors.successBg,
          border: colors.successStrong,
          text: colors.successText,
        };
      case 'absent':
        return {
          bg: colors.dangerBg,
          border: colors.dangerStrong,
          text: colors.dangerText,
        };
      case 'partial':
        return {
          bg: colors.warningBg,
          border: colors.warningStrong,
          text: colors.warningText,
        };
      case 'holiday':
      default:
        return {
          bg: colors.elevated,
          border: colors.border,
          text: colors.textTertiary,
        };
    }
  };

  return (
    <View className="flex-row justify-between mb-4">
      {weekDates.map((date, idx) => {
        const status = getAttendanceStatus(date);
        const isSelected = isSameDay(date, selectedDate);
        const attendance = getAttendanceWithFallback(date);
        const s = getStatusStyles(status);

        return (
          <TouchableOpacity
            key={idx}
            className="flex-1 items-center gap-1.5"
            onPress={() => onDatePress(date)}
            activeOpacity={0.7}
          >
            {/* Day label */}
            <Text
              className="text-[10px] uppercase tracking-wider font-sans-semi"
              style={{
                color: isSelected ? colors.textSecondary : colors.textTertiary,
              }}
            >
              {getDayName(date)}
            </Text>

            {/* Date circle */}
            <View
              className="w-[38px] h-[38px] rounded-full items-center justify-center"
              style={{
                backgroundColor: s.bg,
                borderWidth: 1.5,
                borderColor: isSelected ? (isDark ? '#94A3B8' : '#64748B') : s.border,
              }}
            >
              <Text
                style={{
                  fontFamily: isSelected ? 'Inter_700Bold' : 'Inter_500Medium',
                  fontSize: 14,
                  color: isSelected ? colors.text : s.text,
                }}
              >
                {date.getDate()}
              </Text>
            </View>

            {/* Class count */}
            {attendance && attendance.rtCount > 0 && (
              <Text
                className="text-[9px] text-ink-500 dark:text-ink-500 font-sans"
                style={{
                  opacity: (attendance as any)._isFallback ? 0.6 : 1,
                }}
              >
                {(attendance as any)._isFallback
                  ? `~${attendance.rtCount}`
                  : `${attendance.rtPresent}/${attendance.rtCount}`}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
