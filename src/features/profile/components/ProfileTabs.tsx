import { TabButton, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

type TabType = "personal" | "guardian" | "bank" | "academic";

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
      <TabButton
        label="PERSONAL"
        isActive={activeTab === "personal"}
        onPress={() => onTabChange("personal")}
      />
      <TabButton
        label="GUARDIAN"
        isActive={activeTab === "guardian"}
        onPress={() => onTabChange("guardian")}
      />
      <TabButton
        label="BANK"
        isActive={activeTab === "bank"}
        onPress={() => onTabChange("bank")}
      />
      <TabButton
        label="ACADEMIC"
        isActive={activeTab === "academic"}
        onPress={() => onTabChange("academic")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});
