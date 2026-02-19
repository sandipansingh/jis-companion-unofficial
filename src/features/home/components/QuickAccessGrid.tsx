import { LucideIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View className="mb-4">
      <Text
        className="text-base text-ink-900 dark:text-ink-100 mb-4"
        style={{ fontFamily: "ClashDisplay-Semibold" }}
      >
        Quick Access
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress(item.id)}
            activeOpacity={0.75}
            className="items-center"
            style={{ width: "21%" }}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
              style={{
                backgroundColor: item.color + "18",
                borderWidth: 1,
                borderColor: item.color + "25",
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.14,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <item.icon size={24} color={item.color} strokeWidth={1.8} />
            </View>
            <Text
              className="text-[11px] text-ink-600 dark:text-ink-400 text-center leading-4"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
