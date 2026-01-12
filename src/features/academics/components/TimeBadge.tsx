import { useTheme } from "@/src/contexts/ThemeContext";
import { Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface TimeBadgeProps {
  timeRange: string;
}

export function TimeBadge({ timeRange }: TimeBadgeProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.infoLighter }]}>
      <Clock size={16} color={colors.primary} />
      <Text style={[styles.text, { color: colors.primary }]}>{timeRange}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
