import { ActivityIndicator, View } from "react-native";
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
  return (
    <View
      className="bg-surface rounded-2xl p-4 mb-6 border border-border"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <MonthHeader
        month={currentMonth.getMonth() + 1}
        year={currentMonth.getFullYear()}
        onMonthYearPress={onDateSelect}
        onTodayPress={onTodayPress}
      />

      <WeekNavigator
        weekPeriod={`${weekDates[0].getDate()} – ${weekDates[6].getDate()} ${weekDates[6].toLocaleString(
          "default",
          { month: "long" }
        )}`}
        onPrevious={onPreviousWeek}
        onNext={onNextWeek}
      />

      {loading ? (
        <View className="h-20 items-center justify-center">
          <ActivityIndicator size="small" color="#2B5BDB" />
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
