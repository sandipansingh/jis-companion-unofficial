import { Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface TimeBadgeProps {
  timeRange: string;
}

export function TimeBadge({ timeRange }: TimeBadgeProps) {
  return (
    <View style={styles.badge}>
      <Clock size={16} color="#007AFF" />
      <Text style={styles.text}>{timeRange}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
