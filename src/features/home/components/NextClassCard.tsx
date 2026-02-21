import { useTheme } from "@/src/contexts/ThemeContext";
import { User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface NextClassCardProps {
  className: string;
  faculty: string;
  time: string;
  period: "AM" | "PM";
  isFallback?: boolean;
  onSeeAll: () => void;
}

export function NextClassCard({
  className,
  faculty,
  time,
  period,
  isFallback,
  onSeeAll,
}: NextClassCardProps) {
  const { isDark, colors } = useTheme();

  return (
    <View className="mb-6">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-base text-ink-900 dark:text-ink-100 font-display"
          >
            Up Next
          </Text>
          {isFallback && (
            <View className="bg-warning-light dark:bg-warning-dark/20 rounded-full px-2 py-0.5">
              <Text
                className="text-[10px] text-warning-dark font-sans-md"
              >
                Expected
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text
            className="text-sm text-cobalt-500 dark:text-cobalt-400 font-sans-semi"
          >
            See all →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View
        className="bg-white dark:bg-ink-900 rounded-2xl overflow-hidden flex-row border border-ink-300/50 dark:border-ink-800/70"
        style={{
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.07,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        {/* Time column */}
        <View className="bg-cobalt-500 items-center justify-center px-5 py-5">
          <Text
            className="text-white text-2xl leading-none font-display-bold"
          >
            {time}
          </Text>
          <Text
            className="text-cobalt-200 text-xs tracking-widest mt-0.5 font-sans-md"
          >
            {period}
          </Text>
        </View>

        {/* Info column */}
        <View className="flex-1 px-4 py-5 justify-center gap-1.5">
          <Text
            className="text-base text-ink-900 dark:text-ink-100 leading-tight font-display"
            numberOfLines={2}
          >
            {className}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <User size={12} color={isDark ? colors.ink[400] : colors.ink[500]} />
            <Text
              className="text-sm text-ink-500 dark:text-ink-400 flex-1 font-sans"
              numberOfLines={1}
            >
              {faculty}
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
}
