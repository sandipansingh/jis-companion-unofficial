import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet, TouchableOpacity } from "react-native";

type AttendanceStatus = "present" | "absent" | "partial" | "holiday";

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
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.dayColumn} onPress={onPress}>
      <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
        {dayLabel}
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
          {date}
        </Text>
      </View>
      {classInfo && (
        <Text style={[styles.classCount, { color: colors.textSecondary }]}>
          {classInfo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  presentCircle: {
    backgroundColor: "#10B981",
  },
  absentCircle: {
    backgroundColor: "#EF4444",
  },
  partialCircle: {
    backgroundColor: "#F59E0B",
  },
  holidayCircle: {
    backgroundColor: "#E5E7EB",
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  presentText: {
    color: "#FFFFFF",
  },
  absentText: {
    color: "#FFFFFF",
  },
  partialText: {
    color: "#FFFFFF",
  },
  selectedText: {
    fontWeight: "700",
  },
  classCount: {
    fontSize: 10,
    fontWeight: "500",
  },
});
