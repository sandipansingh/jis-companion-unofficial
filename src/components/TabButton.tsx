import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Themed";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function TabButton({ label, isActive, onPress }: TabButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive && [styles.activeTab, { backgroundColor: colors.primary }],
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          { color: isActive ? "#FFFFFF" : colors.textSecondary },
          isActive && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
});
