import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

interface AcademicCardProps {
  title: string;
  score: string;
}

export function AcademicCard({ title, score }: AcademicCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.academicCard, { borderColor: colors.border }]}>
      <Text style={[styles.academicCardTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.academicCardScore, { color: colors.text }]}>
        {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  academicCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "transparent",
    minWidth: 100,
  },
  academicCardTitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  academicCardScore: {
    fontSize: 20,
    fontWeight: "700",
  },
});
