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
  return (
    <View className="mb-6">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-base text-ink-900 dark:text-ink-100"
            style={{ fontFamily: "ClashDisplay-Semibold" }}
          >
            Up Next
          </Text>
          {isFallback && (
            <View className="bg-warning-light dark:bg-warning-dark/20 rounded-full px-2 py-0.5">
              <Text
                className="text-[10px] text-warning-dark"
                style={{ fontFamily: "GeneralSans-Medium" }}
              >
                Expected
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text
            className="text-sm text-cobalt-500 dark:text-cobalt-400"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            See all →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View
        className="bg-white dark:bg-ink-900 rounded-2xl overflow-hidden flex-row"
        style={{
          borderWidth: 1,
          borderColor: "rgba(203,213,225,0.5)",
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
            className="text-white text-2xl leading-none"
            style={{ fontFamily: "ClashDisplay-Bold" }}
          >
            {time}
          </Text>
          <Text
            className="text-cobalt-200 text-xs tracking-widest mt-0.5"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            {period}
          </Text>
        </View>

        {/* Info column */}
        <View className="flex-1 px-4 py-5 justify-center gap-1.5">
          <Text
            className="text-base text-ink-900 dark:text-ink-100 leading-tight"
            style={{ fontFamily: "ClashDisplay-Semibold" }}
            numberOfLines={2}
          >
            {className}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <User size={12} color="#94A3B8" />
            <Text
              className="text-sm text-ink-500 dark:text-ink-400 flex-1"
              style={{ fontFamily: "GeneralSans-Regular" }}
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
