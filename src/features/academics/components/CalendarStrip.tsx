import { useTheme } from "@/src/contexts/ThemeContext";
import { getDayName, isSameDay } from "@/src/utils/dateHelpers";
import { Text, TouchableOpacity, View } from "react-native";

type AttendanceStatus = "present" | "absent" | "partial" | "holiday";

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
  const { isDark } = useTheme();

  const getStatusStyles = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return {
          bg: isDark ? "#064E3B" : "#ECFDF5",
          border: isDark ? "#059669" : "#059669",
          text: isDark ? "#A7F3D0" : "#059669",
        };
      case "absent":
        return {
          bg: isDark ? "#500707" : "#FEF2F2",
          border: isDark ? "#991B1B" : "#DC2626",
          text: isDark ? "#FECACA" : "#DC2626",
        };
      case "partial":
        return {
          bg: isDark ? "#451a03" : "#FFFBEB",
          border: isDark ? "#D97706" : "#D97706",
          text: isDark ? "#fbbf24" : "#D97706", // Fixed yellow color syntax
        };
      case "holiday":
      default:
        return {
          bg: isDark ? "#1e293b" : "#F1F5F9",
          border: isDark ? "#334155" : "#CBD5E1",
          text: isDark ? "#94a3b8" : "#94A3B8",
        };
    }
  };

  return (
    <View className="flex-row justify-between mb-4">
      {weekDates.map((date, idx) => {
        const status = getAttendanceStatus(date);
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());
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
              className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400"
              style={{
                fontFamily: "GeneralSans-Semibold",
              }}
            >
              {getDayName(date)}
            </Text>

            {/* Date circle */}
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: s.bg,
                borderWidth: isSelected ? 2.5 : 1.5,
                borderColor: isSelected ? (isDark ? "#60A5FA" : "#2B5BDB") : s.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: isSelected
                    ? "ClashDisplay-Semibold"
                    : "GeneralSans-Medium",
                  fontSize: 14,
                  color: isSelected ? (isDark ? "#FFFFFF" : "#2B5BDB") : s.text,
                }}
              >
                {date.getDate()}
              </Text>
            </View>

            {/* Class count */}
            {attendance && attendance.rtCount > 0 && (
              <Text
                className="text-[9px] text-ink-500 dark:text-ink-500"
                style={{
                  fontFamily: "GeneralSans-Regular",
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
