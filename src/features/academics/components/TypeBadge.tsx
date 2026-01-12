import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface TypeBadgeProps {
  type: "LAB" | "THEORY";
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.gray100 }]}>
      <Text style={[styles.text, { color: colors.gray400 }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});
