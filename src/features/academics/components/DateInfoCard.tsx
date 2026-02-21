import { Calendar } from "lucide-react-native";
import { Text, View } from "react-native";

interface DateInfoCardProps {
  date: string;
}

export function DateInfoCard({ date }: DateInfoCardProps) {
  const dateObj = new Date(date);
  const isValidDate = !Number.isNaN(dateObj.getTime());

  const formatted = isValidDate
    ? dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const weekday = isValidDate
    ? dateObj.toLocaleDateString("en-US", { weekday: "long" })
    : "Invalid date";

  return (
    <View
      className="bg-surface dark:bg-ink-900 rounded-2xl border border-border p-4 mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        className="text-[10px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-2.5 font-sans-semi"
      >
        Date
      </Text>
      <View className="flex-row items-center justify-between bg-cobalt-50 dark:bg-ink-800 rounded-xl p-3">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-cobalt-500 items-center justify-center">
            <Calendar size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text
              className="text-base text-cobalt-900 dark:text-white font-display"
            >
              {formatted}
            </Text>
            <Text
              className="text-xs text-cobalt-500 dark:text-ink-300 font-sans"
            >
              {weekday}
            </Text>
          </View>
        </View>
        <Calendar size={12} color="#2B5BDB" style={{ opacity: 0.3 }} />
      </View>
    </View>
  );
}
