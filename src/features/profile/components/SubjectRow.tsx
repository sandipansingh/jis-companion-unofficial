import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

interface SubjectRowProps {
  subject: string;
  obtained: number;
  full: number;
}

export function SubjectRow({ subject, obtained, full }: SubjectRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.subjectRow}>
      <Text style={[styles.subjectName, { color: colors.text }]}>
        {subject}
      </Text>
      <Text style={[styles.subjectScore, { color: colors.primary }]}>
        {obtained}/{full}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
  },
  subjectScore: {
    fontSize: 14,
    fontWeight: "700",
  },
});
