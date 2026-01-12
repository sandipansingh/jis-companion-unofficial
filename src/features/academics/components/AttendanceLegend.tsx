import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export function AttendanceLegend() {
  const { colors } = useTheme();

  return (
    <View style={[styles.legend, { borderTopColor: colors.gray200 }]}>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.legendDot,
            {
              backgroundColor: colors.success + "20",
              borderWidth: 2,
              borderColor: colors.success,
            },
          ]}
        />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Present
        </Text>
      </View>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.legendDot,
            {
              backgroundColor: colors.warning + "20",
              borderWidth: 2,
              borderColor: colors.warning,
            },
          ]}
        />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Partial
        </Text>
      </View>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.legendDot,
            {
              backgroundColor: colors.error + "20",
              borderWidth: 2,
              borderColor: colors.error,
            },
          ]}
        />
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
  legendText: {
    fontSize: 11,
  },
});
