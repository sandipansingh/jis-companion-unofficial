import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Clock, User } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SubjectWiseAttendance } from "../api";

interface ClassCardProps {
  classData: SubjectWiseAttendance;
  time: string;
  isFallback?: boolean;
  onPress?: () => void;
}

export function ClassCard({
  classData,
  time,
  isFallback = false,
  onPress,
}: ClassCardProps) {
  const { colors } = useTheme();

  const subjectParts = classData.subject_name.split(" - ");
  const subjectCode = subjectParts[0]?.trim();
  const subjectName = subjectParts[1]?.trim() || classData.subject_name;

  return (
    <TouchableOpacity
      style={[
        styles.classCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        isFallback && styles.fallbackCard,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.classHeader}>
        <View
          style={[
            styles.subjectBadge,
            { backgroundColor: colors.primary + "15" },
            isFallback && { opacity: 0.6 },
          ]}
        >
          <Text style={[styles.subjectCode, { color: colors.primary }]}>
            {subjectCode}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {time}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.subjectName,
          { color: colors.text },
          isFallback && styles.fallbackText,
        ]}
        numberOfLines={2}
      >
        {subjectName}
      </Text>

      <View style={styles.facultyRow}>
        <User size={14} color={colors.textSecondary} />
        <Text
          style={[
            styles.facultyName,
            { color: colors.textSecondary },
            isFallback && styles.fallbackText,
          ]}
          numberOfLines={1}
        >
          {classData.faculty}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  classCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fallbackCard: {
    opacity: 0.7,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
  },
  facultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  facultyName: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  fallbackText: {
    fontStyle: "italic",
  },
});
