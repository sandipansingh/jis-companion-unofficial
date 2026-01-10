import { StyleSheet, Text, View } from "react-native";

interface TypeBadgeProps {
  type: "LAB" | "THEORY";
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
});
