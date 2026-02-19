import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

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
  iconSize = 40,
  iconCircleSize = 80,
}: HeaderCardProps) {
  return (
    <View
      className="bg-surface dark:bg-surface rounded-3xl p-8 mb-6 items-center border border-border"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        className="rounded-3xl items-center justify-center mb-5 bg-cobalt-50 dark:bg-ink-800"
        style={{ width: iconCircleSize, height: iconCircleSize }}
      >
        <Icon size={iconSize} color="#2B5BDB" />
      </View>
      <Text
        className="text-2xl text-ink-950 dark:text-white mb-2 text-center"
        style={{ fontFamily: "ClashDisplay-Semibold" }}
      >
        {title}
      </Text>
      <Text
        className="text-sm text-ink-600 dark:text-ink-400 text-center leading-5"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        {description}
      </Text>
    </View>
  );
}
