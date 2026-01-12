import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Check, X } from "lucide-react-native";
import { StyleSheet } from "react-native";

interface AttendanceStatusCardProps {
  status: string;
}

export function AttendanceStatusCard({ status }: AttendanceStatusCardProps) {
  const { colors } = useTheme();
  const isPresent = status.toLowerCase() === "present";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Attendance Status
        </Text>
      </View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isPresent ? colors.greenLight : colors.redLight,
          },
        ]}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isPresent ? colors.success : colors.error,
              },
            ]}
          >
            {isPresent ? (
              <Check size={22} color={colors.surface} />
            ) : (
              <X size={22} color={colors.surface} />
            )}
          </View>
          <View style={{ backgroundColor: "transparent" }}>
            <Text
              style={[
                styles.statusText,
                {
                  color: isPresent ? colors.successDarker : colors.errorDarker,
                },
              ]}
            >
              {status}
            </Text>
            <Text
              style={[
                styles.subtext,
                {
                  color: isPresent ? colors.successDark : colors.errorDark,
                },
              ]}
            >
              {isPresent ? "You attended this class" : "You missed this class"}
            </Text>
          </View>
        </View>
        {isPresent ? (
          <Check size={12} color={colors.success} style={{ opacity: 0.3 }} />
        ) : (
          <X size={12} color={colors.error} style={{ opacity: 0.3 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtext: {
    fontSize: 13,
    fontWeight: "500",
  },
});
