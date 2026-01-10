import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { getMonthName } from "@/src/utils/dateHelpers";
import { StyleSheet, TouchableOpacity } from "react-native";

interface MonthHeaderProps {
  month: number;
  year: number;
  onMonthYearPress: () => void;
  onTodayPress: () => void;
}

export function MonthHeader({
  month,
  year,
  onMonthYearPress,
  onTodayPress,
}: MonthHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMonthYearPress} style={styles.monthButton}>
        <Text style={[styles.title, { color: colors.text }]}>
          {getMonthName(month)} {year}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onTodayPress} style={styles.todayButton}>
        <Text style={[styles.todayText, { color: colors.primary }]}>Today</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  todayText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
