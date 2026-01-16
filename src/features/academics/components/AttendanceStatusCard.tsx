import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Check, Clock, X } from "lucide-react-native";
import { StyleSheet } from "react-native";

interface AttendanceStatusCardProps {
  status: string;
}

export function AttendanceStatusCard({ status }: AttendanceStatusCardProps) {
  const { colors } = useTheme();
  const isPresent = status.toLowerCase() === "present";
  const isNotYetAvailable = status.toLowerCase() === "not yet available";

  const backgroundColor = isPresent
    ? colors.greenLight
    : isNotYetAvailable
    ? colors.background
    : colors.redLight;

  const iconBgColor = isPresent
    ? colors.success
    : isNotYetAvailable
    ? colors.textSecondary
    : colors.error;

  const textColor = isPresent
    ? colors.successDarker
    : isNotYetAvailable
    ? colors.text
    : colors.errorDarker;

  const subtextColor = isPresent ? colors.successDark : colors.errorDark;

  const subtextContent = isPresent
    ? "You attended this class"
    : isNotYetAvailable
    ? ""
    : "You missed this class";

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
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconBgColor,
              },
            ]}
          >
            {isPresent ? (
              <Check size={22} color={colors.surface} />
            ) : isNotYetAvailable ? (
              <Clock size={22} color={colors.surface} />
            ) : (
              <X size={22} color={colors.surface} />
            )}
          </View>
          <View style={{ backgroundColor: "transparent" }}>
            <Text
              style={[
                styles.statusText,
                {
                  color: textColor,
                },
              ]}
            >
              {status}
            </Text>
            {subtextContent !== "" && (
              <Text
                style={[
                  styles.subtext,
                  {
                    color: subtextColor,
                  },
                ]}
              >
                {subtextContent}
              </Text>
            )}
          </View>
        </View>
        {isPresent ? (
          <Check size={12} color={colors.success} style={{ opacity: 0.3 }} />
        ) : isNotYetAvailable ? (
          <Clock size={12} color={iconBgColor} style={{ opacity: 0.3 }} />
        ) : (
          <X size={12} color={iconBgColor} style={{ opacity: 0.3 }} />
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
