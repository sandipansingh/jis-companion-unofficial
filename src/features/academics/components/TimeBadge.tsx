import { useTheme } from "@/src/contexts/ThemeContext";
import { Clock } from "lucide-react-native";
import { Text, View } from "react-native";

interface TimeBadgeProps {
  timeRange: string;
}

export function TimeBadge({ timeRange }: TimeBadgeProps) {
  const { isDark } = useTheme();
  return (
    <View className="flex-row items-center gap-1.5 bg-cobalt-50 dark:bg-ink-800 border border-border rounded-full px-4 py-2">
      <Clock size={14} color={isDark ? "#7DAAF9" : "#2B5BDB"} />
      <Text
        className="text-sm text-cobalt-600 dark:text-cobalt-300 font-sans-semi"
      >
        {timeRange}
      </Text>
    </View>
  );
}
