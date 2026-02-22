import { useTheme } from "@/src/contexts/ThemeContext";
import { LucideIcon } from "lucide-react-native";
import { Platform, Text, TouchableOpacity, View } from "react-native";

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
  const { isDark } = useTheme();

  const toRgba = (hexColor: string, opacity: number) => {
    const hex = hexColor.replace("#", "");
    if (hex.length !== 6) return hexColor;

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  };

  return (
    <View className="mt-4">
      <Text
        className="text-base text-ink-900 dark:text-ink-100 mb-4 font-display"
      >
        Quick Access
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress(item.id)}
            activeOpacity={0.75}
            className="items-center w-[21%] mb-4"
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
              style={{
                backgroundColor: toRgba(item.color, isDark ? 0.28 : 0.16),
                borderWidth: 1,
                borderColor: toRgba(item.color, isDark ? 0.42 : 0.22),
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: Platform.OS === "android" ? 0 : 0.14,
                shadowRadius: 8,
                elevation: Platform.OS === "android" ? 0 : 3,
              }}
            >
              <item.icon size={24} color={item.color} strokeWidth={1.8} />
            </View>
            <Text
              className="text-[11px] text-ink-600 dark:text-ink-400 text-center leading-4 font-sans-md"
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
