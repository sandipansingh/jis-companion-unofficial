import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { FlaskConical, PlayCircle } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ExperimentCardProps {
  serialNumber: string;
  subjectCode?: string;
  experimentName: string;
  onPress: () => void;
}

export function ExperimentCard({
  serialNumber,
  subjectCode,
  experimentName,
  onPress,
}: ExperimentCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.experimentCard,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.experimentCardHeader}>
        <View
          style={[
            styles.experimentIconBox,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <FlaskConical size={20} color={colors.primary} />
        </View>
        <View style={styles.headerRight}>
          <View
            style={[styles.serialBadge, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.serialText, { color: colors.textSecondary }]}>
              Serial: {serialNumber}
            </Text>
          </View>
          {subjectCode && (
            <Text style={[styles.subjectCode, { color: colors.textSecondary }]}>
              {subjectCode}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.experimentInfo}>
        <Text style={[styles.experimentName, { color: colors.text }]}>
          {experimentName}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <PlayCircle size={18} color={colors.primary} />
        <Text style={[styles.startButtonText, { color: colors.primary }]}>
          Start Simulation
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  experimentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  experimentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  experimentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  serialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  serialText: {
    fontSize: 10,
    fontWeight: "700",
  },
  experimentInfo: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  experimentName: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
