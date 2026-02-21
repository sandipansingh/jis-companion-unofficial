import { getMonthName } from "@/src/utils/dateHelpers";
import { Text, TouchableOpacity, View } from "react-native";

interface MonthHeaderProps {
  month: number;
  year: number;
  onMonthYearPress: () => void;
  onTodayPress: () => void;
}

export function MonthHeader({
  month,
  year,
  onMonthYearPress,
  onTodayPress,
}: MonthHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <TouchableOpacity onPress={onMonthYearPress} activeOpacity={0.7}>
        <Text
          className="text-base text-ink-950 dark:text-white font-display"
        >
          {getMonthName(month)}, {year}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onTodayPress}
        activeOpacity={0.7}
        className="bg-cobalt-50 dark:bg-ink-800 border border-border rounded-xl px-3 py-1"
      >
        <Text
          className="text-xs text-cobalt-600 dark:text-cobalt-300 font-sans-semi"
        >
          Today
        </Text>
      </TouchableOpacity>
    </View>
  );
}
