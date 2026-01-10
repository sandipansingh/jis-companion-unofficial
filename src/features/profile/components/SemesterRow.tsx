import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

interface SemesterRowProps {
  semester: number;
  sgpa?: number | string;
}

export function SemesterRow({ semester, sgpa }: SemesterRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.semesterRow,
        {
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.semesterText, { color: colors.text }]}>
        Semester {semester}
      </Text>
      {sgpa ? (
        <View style={[styles.sgpaBadge, styles.sgpaBadgeGreen]}>
          <Text style={styles.sgpaText}>SGPA: {sgpa}</Text>
        </View>
      ) : (
        <View style={[styles.sgpaBadge, styles.sgpaBadgeGray]}>
          <Text style={styles.sgpaTextGray}>N/A</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  semesterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  semesterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sgpaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sgpaBadgeGreen: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#6ee7b7",
  },
  sgpaBadgeGray: {
    backgroundColor: "#e2e8f0",
  },
  sgpaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  sgpaTextGray: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
});
