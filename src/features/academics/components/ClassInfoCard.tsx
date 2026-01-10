import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { MapPin } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { FacultyInfo } from "./FacultyInfo";
import { TimeBadge } from "./TimeBadge";
import { TypeBadge } from "./TypeBadge";

interface ClassInfoCardProps {
  subjectName: string;
  timeRange: string;
  classType: "LAB" | "THEORY";
  facultyName: string;
  location: string;
}

export function ClassInfoCard({
  subjectName,
  timeRange,
  classType,
  facultyName,
  location,
}: ClassInfoCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Badge Row */}
      <View style={styles.badgeRow}>
        <TimeBadge timeRange={timeRange} />
        <TypeBadge type={classType} />
      </View>

      {/* Subject Name */}
      <Text style={[styles.subjectName, { color: colors.text }]}>
        {subjectName}
      </Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <MapPin size={16} color="#6B7280" />
        <Text style={[styles.locationText, { color: colors.textSecondary }]}>
          {location}
        </Text>
      </View>

      {/* Faculty */}
      <FacultyInfo facultyName={facultyName} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "transparent",
  },
  locationText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
