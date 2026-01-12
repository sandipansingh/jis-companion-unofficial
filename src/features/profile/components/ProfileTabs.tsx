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
    <View
      style={[
        styles.tabContainer,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
});
