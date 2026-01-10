import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { getMonthName, isSameDay } from "@/src/utils/dateHelpers";
import { StyleSheet } from "react-native";
import { RoutineTimelineItem } from "./RoutineTimelineItem";

interface ClassRoutineSectionProps {
  selectedDate: Date;
  routine: any[];
  isFallbackData: boolean;
  getDisplayTime: (classItem: any) => string;
  onClassPress: (classItem: any) => void;
}

export function ClassRoutineSection({
  selectedDate,
  routine,
  isFallbackData,
  getDisplayTime,
  onClassPress,
}: ClassRoutineSectionProps) {
  const { colors } = useTheme();

  if (routine.length === 0) return null;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {isSameDay(selectedDate, new Date())
          ? "Today's Routine"
          : `Class Routine - ${selectedDate.getDate()} ${getMonthName(
              selectedDate.getMonth() + 1
            )}`}
        {isFallbackData && (
          <Text
            style={[styles.fallbackIndicator, { color: colors.textSecondary }]}
          >
            {" "}
            (Based on previous week)
          </Text>
        )}
      </Text>
      <View style={styles.routineContainer}>
        {routine.map((classItem, index) => (
          <RoutineTimelineItem
            key={index}
            classItem={classItem}
            time={getDisplayTime(classItem)}
            isLast={index === routine.length - 1}
            onPress={() => onClassPress(classItem)}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fallbackIndicator: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  routineContainer: {
    gap: 0,
  },
});
