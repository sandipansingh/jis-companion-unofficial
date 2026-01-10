import { View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ActivityIndicator, StyleSheet } from "react-native";
import { AttendanceLegend } from "./AttendanceLegend";
import { CalendarStrip } from "./CalendarStrip";
import { MonthHeader } from "./MonthHeader";
import { WeekNavigator } from "./WeekNavigator";

type AttendanceStatus = "present" | "absent" | "partial" | "holiday";

interface AttendanceData {
  rtDate: string;
  rtCount: number;
  rtPresent: number;
  _isFallback?: boolean;
}

interface AttendanceCalendarProps {
  currentMonth: Date;
  weekDates: Date[];
  selectedDate: Date;
  loading: boolean;
  onDateSelect: () => void;
  onTodayPress: () => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onDatePress: (date: Date) => void;
  getAttendanceStatus: (date: Date) => AttendanceStatus;
  getAttendanceWithFallback: (date: Date) => AttendanceData | null | undefined;
}

export function AttendanceCalendar({
  currentMonth,
  weekDates,
  selectedDate,
  loading,
  onDateSelect,
  onTodayPress,
  onPreviousWeek,
  onNextWeek,
  onDatePress,
  getAttendanceStatus,
  getAttendanceWithFallback,
}: AttendanceCalendarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <MonthHeader
        month={currentMonth.getMonth() + 1}
        year={currentMonth.getFullYear()}
        onMonthYearPress={onDateSelect}
        onTodayPress={onTodayPress}
      />

      <WeekNavigator
        weekPeriod={`${weekDates[0].getDate()} - ${weekDates[6].getDate()} ${weekDates[6].toLocaleString(
          "default",
          { month: "long" }
        )}`}
        onPrevious={onPreviousWeek}
        onNext={onNextWeek}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <>
          <CalendarStrip
            weekDates={weekDates}
            selectedDate={selectedDate}
            onDatePress={onDatePress}
            getAttendanceStatus={getAttendanceStatus}
            getAttendanceWithFallback={getAttendanceWithFallback}
          />
          <AttendanceLegend />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
