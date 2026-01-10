import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
}

interface QuickAccessGridProps {
  items: MenuItem[];
  onItemPress: (itemId: string) => void;
}

export function QuickAccessGrid({ items, onItemPress }: QuickAccessGridProps) {
  const { colors } = useTheme();

  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, marginTop: 24, marginBottom: 16 },
        ]}
      >
        Quick Access
      </Text>

      <View style={styles.gridContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => onItemPress(item.id)}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}
            >
              <item.icon size={24} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    backgroundColor: "transparent",
  },
  menuItem: {
    width: "23%",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 12,
  },
});
