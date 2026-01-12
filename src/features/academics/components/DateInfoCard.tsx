import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Calendar } from "lucide-react-native";
import { StyleSheet } from "react-native";

interface DateInfoCardProps {
  date: string;
}

export function DateInfoCard({ date }: DateInfoCardProps) {
  const { colors } = useTheme();
  const dateObj = new Date(date);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Date
        </Text>
      </View>
      <View
        style={[styles.dateContainer, { backgroundColor: colors.skyLight }]}
      >
        <View style={[styles.dateLeft, { backgroundColor: "transparent" }]}>
          <View
            style={[styles.iconContainer, { backgroundColor: colors.infoDark }]}
          >
            <Calendar size={22} color={colors.surface} />
          </View>
          <View style={{ backgroundColor: "transparent" }}>
            <Text style={[styles.dateMainText, { color: colors.infoDarkest }]}>
              {dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text style={[styles.dateSubtext, { color: colors.infoDarker }]}>
              {dateObj.toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </Text>
          </View>
        </View>
        <Calendar size={12} color={colors.infoDark} style={{ opacity: 0.3 }} />
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 16,
  },
  dateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  dateMainText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 13,
    fontWeight: "500",
  },
});
