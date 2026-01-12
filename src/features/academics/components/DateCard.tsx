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
          status === "present" && { backgroundColor: colors.success },
          status === "absent" && { backgroundColor: colors.error },
          status === "partial" && { backgroundColor: colors.warning },
          status === "holiday" && styles.holidayCircle,
          isSelected && { borderWidth: 2, borderColor: colors.info },
          isToday && { borderWidth: 2, borderColor: colors.purple },
        ]}
      >
        <Text
          style={[
            styles.dateText,
            { color: colors.textSecondary },
            status === "present" && { color: "#ffffff" },
            status === "absent" && { color: "#ffffff" },
            status === "partial" && { color: "#ffffff" },
            status === "holiday" && { color: colors.textSecondary },
            isSelected && { fontWeight: "700" },
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
  holidayCircle: {
    backgroundColor: "#E5E7EB",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  classCount: {
    fontSize: 10,
    fontWeight: "500",
  },
});
