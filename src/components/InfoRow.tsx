import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";

interface InfoRowProps {
  label: string;
  value: string | undefined;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  isLast?: boolean;
}

export function InfoRow({
  label,
  value,
  icon: Icon,
  isLast = false,
}: InfoRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.infoRowContainer}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.infoValueRow}>
        <Icon size={18} color={colors.primary} />
        <Text
          style={[
            styles.infoValue,
            { color: value ? colors.text : colors.textSecondary },
            !value && styles.italicText,
          ]}
        >
          {value || "Not Provided"}
        </Text>
      </View>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border + "70" }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoRowContainer: {
    backgroundColor: "transparent",
    paddingVertical: 7,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "400",
    flex: 1,
  },
  italicText: {
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    marginTop: 12,
  },
});
