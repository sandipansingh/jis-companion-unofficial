import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { User } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface NextClassCardProps {
  className: string;
  faculty: string;
  time: string;
  period: "AM" | "PM";
  isFallback?: boolean;
  onSeeAll: () => void;
}

export function NextClassCard({
  className,
  faculty,
  time,
  period,
  isFallback,
  onSeeAll,
}: NextClassCardProps) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Up Next
          {isFallback && (
            <Text
              style={[styles.fallbackText, { color: colors.textSecondary }]}
            >
              {" "}
              (Expected)
            </Text>
          )}
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.nextClassCard,
          { backgroundColor: colors.surface, shadowColor: colors.shadow },
        ]}
      >
        <View
          style={[styles.timeBox, { backgroundColor: colors.primary + "20" }]}
        >
          <Text style={[styles.timeText, { color: colors.primary }]}>
            {time}
          </Text>
          <Text style={[styles.timeAmPm, { color: colors.textSecondary }]}>
            {period}
          </Text>
        </View>
        <View style={[styles.classInfo, { borderLeftColor: colors.border }]}>
          <Text style={[styles.className, { color: colors.text }]}>
            {className}
          </Text>

          <View style={styles.upNextClassFacultyRow}>
            <User size={12} color={colors.textSecondary} />
            <Text
              style={[styles.classDetails, { color: colors.textSecondary }]}
            >
              {faculty}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
  },
  nextClassCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeBox: {
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  timeAmPm: {
    fontSize: 12,
    marginTop: 2,
  },
  classInfo: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: 16,
    backgroundColor: "transparent",
  },
  className: {
    fontSize: 13,
    fontWeight: "bold",
  },
  classDetails: {
    fontSize: 12,
  },
  upNextClassFacultyRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
});
