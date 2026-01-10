import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { getDayName, isSameDay } from "@/src/utils/dateHelpers";
import { StyleSheet, TouchableOpacity } from "react-native";

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
  const { colors } = useTheme();

  return (
    <View style={styles.strip}>
      {weekDates.map((date, idx) => {
        const status = getAttendanceStatus(date);
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());
        const attendance = getAttendanceWithFallback(date);

        return (
          <TouchableOpacity
            key={idx}
            style={styles.dayColumn}
            onPress={() => onDatePress(date)}
          >
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
              {getDayName(date)}
            </Text>
            <View
              style={[
                styles.dateCircle,
                status === "present" && styles.presentCircle,
                status === "absent" && styles.absentCircle,
                status === "partial" && styles.partialCircle,
                status === "holiday" && styles.holidayCircle,
                isSelected && styles.selectedCircle,
                isToday && styles.todayCircle,
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  status === "present" && styles.presentText,
                  status === "absent" && styles.absentText,
                  status === "partial" && styles.partialText,
                  status === "holiday" && { color: colors.textSecondary },
                  isSelected && styles.selectedText,
                ]}
              >
                {date.getDate()}
              </Text>
            </View>
            {attendance && attendance.rtCount > 0 && (
              <Text
                style={[
                  styles.classCount,
                  { color: colors.textSecondary },
                  (attendance as any)._isFallback && {
                    opacity: 0.6,
                    fontStyle: "italic",
                  },
                ]}
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

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  presentCircle: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  absentCircle: {
    backgroundColor: "#EF444420",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  partialCircle: {
    backgroundColor: "#F59E0B20",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  holidayCircle: {
    backgroundColor: "#F1F5F9",
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  todayCircle: {
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  presentText: {
    color: "#10B981",
  },
  absentText: {
    color: "#EF4444",
  },
  partialText: {
    color: "#F59E0B",
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  classCount: {
    fontSize: 10,
    marginTop: 2,
  },
});
