import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface ProgressCardProps {
  submittedCount: number;
  pendingCount: number;
  notOptedCount: number;
  progressPercentage: number;
}

export function ProgressCard({
  submittedCount,
  pendingCount,
  notOptedCount,
  progressPercentage,
}: ProgressCardProps) {
  return (
    <View
      className="bg-surface dark:bg-ink-900 rounded-2xl border border-border p-4 overflow-hidden mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Decorative circles */}
      <View
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cobalt-500/10"
        pointerEvents="none"
      />
      <View
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cobalt-300/10"
        pointerEvents="none"
      />

      {/* Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text
            className="text-lg text-ink-900 dark:text-white"
            style={{ fontFamily: 'ClashDisplay-Semibold' }}
          >
            Your Progress
          </Text>
          <Text
            className="text-xs text-ink-500 dark:text-ink-400 mt-0.5"
            style={{ fontFamily: 'GeneralSans-Regular' }}
          >
            Complete feedback for all subjects
          </Text>
        </View>
        <Text
          className="text-3xl text-cobalt-600 dark:text-cobalt-300"
          style={{ fontFamily: 'ClashDisplay-Bold' }}
        >
          {progressPercentage}%
        </Text>
      </View>

      {/* Stats grid */}
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1 bg-success-light/60 dark:bg-green-900/30 border border-success-light dark:border-green-800 rounded-xl p-3 items-center">
          <Text
            className="text-xl text-green-800 dark:text-green-300"
            style={{ fontFamily: 'ClashDisplay-Bold' }}
          >
            {submittedCount}
          </Text>
          <Text
            className="text-[9px] text-green-700 dark:text-green-400 uppercase tracking-widest mt-0.5"
            style={{ fontFamily: 'GeneralSans-Semibold' }}
          >
            Done
          </Text>
        </View>
        <View className="flex-1 bg-warning-light/60 dark:bg-yellow-900/30 border border-warning/20 dark:border-yellow-800 rounded-xl p-3 items-center">
          <Text
            className="text-xl text-yellow-800 dark:text-yellow-300"
            style={{ fontFamily: "ClashDisplay-Bold" }}
          >
            {pendingCount}
          </Text>
          <Text
            className="text-[9px] text-yellow-700 uppercase tracking-widest mt-0.5"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            Pending
          </Text>
        </View>
        <View className="flex-1 bg-ink-100 dark:bg-ink-800 border border-border rounded-xl p-3 items-center">
          <Text
            className="text-xl text-ink-700 dark:text-ink-300"
            style={{ fontFamily: "ClashDisplay-Bold" }}
          >
            {notOptedCount}
          </Text>
          <Text
            className="text-[9px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mt-0.5"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            Skipped
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-3 bg-ink-200 dark:bg-ink-800 rounded-full overflow-hidden">
        <LinearGradient
          colors={["#2B5BDB", "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
}
