import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export function AttendanceLegend() {
  const { colors } = useTheme();

  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.presentCircle]} />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Present
        </Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.partialCircle]} />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Partial
        </Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.absentCircle]} />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Absent
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "transparent",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  presentCircle: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  absentCircle: {
    backgroundColor: "#EF444420",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  partialCircle: {
    backgroundColor: "#F59E0B20",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  legendText: {
    fontSize: 11,
  },
});
