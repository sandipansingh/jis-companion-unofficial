import { useTheme } from "@/src/contexts/ThemeContext";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface HeaderCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconSize?: number;
  iconCircleSize?: number;
}

export function HeaderCard({
  title,
  description,
  icon: Icon,
  iconSize = 48,
  iconCircleSize = 96,
}: HeaderCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.headerCard,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.primary + "20",
            width: iconCircleSize,
            height: iconCircleSize,
            borderRadius: iconCircleSize / 2,
          },
        ]}
      >
        <Icon size={iconSize} color={colors.primary} />
      </View>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.headerDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  headerDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
