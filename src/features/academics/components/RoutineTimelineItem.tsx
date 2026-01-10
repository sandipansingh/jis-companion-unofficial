import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { isClassInFuture } from "@/src/utils/dateHelpers";
import { parseSubjectName } from "@/src/utils/stringHelpers";
import { User } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SubjectWiseAttendance } from "../api";

interface RoutineTimelineItemProps {
  classItem: SubjectWiseAttendance;
  time: string;
  isLast: boolean;
  onPress: () => void;
}

export function RoutineTimelineItem({
  classItem,
  time,
  isLast,
  onPress,
}: RoutineTimelineItemProps) {
  const { colors } = useTheme();

  const hasActualData =
    !isClassInFuture(classItem.date1, classItem.Period_name) &&
    !(classItem as any)._isFallback;

  const statValue = hasActualData
    ? classItem.stat || (classItem.present1 === 1 ? "Present" : "Absent")
    : undefined;

  const isPresent =
    statValue?.toLowerCase() === "present" || classItem.present1 === 1;

  return (
    <View style={styles.routineItem}>
      {/* Time Column */}
      <View style={styles.timeColumn}>
        <Text style={[styles.timeText, { color: colors.text }]}>{time}</Text>
        {/* Vertical Line */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineDot} />
          {!isLast && <View style={styles.timelineLine} />}
        </View>
      </View>

      {/* Class Card */}
      <TouchableOpacity
        style={[
          styles.classCard,
          { backgroundColor: colors.surface },
          hasActualData
            ? isPresent
              ? styles.presentCard
              : styles.absentCard
            : { borderLeftColor: "transparent" },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.subjectName, { color: colors.text }]}>
          {parseSubjectName(classItem.subject_name).name}
        </Text>
        <View style={styles.classDetails}>
          <View style={styles.detailRow}>
            <User size={12} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {classItem.faculty}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  routineItem: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  timeColumn: {
    width: 80,
    alignItems: "flex-start",
    paddingTop: 4,
    backgroundColor: "transparent",
    position: "relative",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timelineContainer: {
    position: "absolute",
    left: 8,
    top: 28,
    bottom: 0,
    width: 2,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -4,
    backgroundColor: "#D1D5DB",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 2,
    backgroundColor: "#D1D5DB",
  },
  classCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  presentCard: {
    borderLeftColor: "#10B981",
  },
  absentCard: {
    borderLeftColor: "#EF4444",
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  classDetails: {
    gap: 6,
    backgroundColor: "transparent",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  detailText: {
    fontSize: 14,
  },
});
