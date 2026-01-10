import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { FlaskConical } from "lucide-react-native";
import { StyleSheet } from "react-native";

export function CourseInfoCard() {
  const { colors } = useTheme();

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}
      >
        <FlaskConical size={40} color={colors.primary} />
      </View>
      <Text style={[styles.infoTitle, { color: colors.text }]}>
        Lab Configuration
      </Text>
      <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
        Select your course details to view available virtual experiments.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
