import { useTheme } from "@/src/contexts/ThemeContext";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LibraryMenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  onPress: () => void;
}

export function LibraryMenuCard({
  title,
  description,
  icon: Icon,
  iconColor,
  onPress,
}: LibraryMenuCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuCardLeft}>
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Icon size={28} color={iconColor} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text
            style={[styles.menuDescription, { color: colors.textSecondary }]}
          >
            {description}
          </Text>
        </View>
      </View>
      <ChevronRight size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  menuCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
