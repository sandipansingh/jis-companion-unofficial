import { FlaskConical, PlayCircle } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface ExperimentCardProps {
  serialNumber: string;
  subjectCode?: string;
  experimentName: string;
  onPress: () => void;
}

export function ExperimentCard({
  serialNumber,
  subjectCode,
  experimentName,
  onPress,
}: ExperimentCardProps) {
  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 rounded-xl bg-cobalt-50 dark:bg-ink-800 border border-border items-center justify-center">
          <FlaskConical size={18} color="#2B5BDB" />
        </View>
        <View className="flex-1 gap-1">
          <View className="bg-ink-100 dark:bg-ink-800 rounded-full px-2.5 py-0.5 self-start">
            <Text
              className="text-[10px] text-ink-500 dark:text-ink-300"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              #{serialNumber}
            </Text>
          </View>
          {subjectCode && (
            <Text
              className="text-xs text-ink-500 dark:text-ink-400"
              style={{ fontFamily: "GeneralSans-Regular" }}
            >
              {subjectCode}
            </Text>
          )}
        </View>
      </View>

      {/* Experiment name */}
      <Text
        className="text-base text-ink-900 dark:text-white leading-snug mb-3"
        style={{ fontFamily: "GeneralSans-Semibold" }}
      >
        {experimentName}
      </Text>

      {/* Start button */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-2 bg-cobalt-50 dark:bg-ink-900 border border-border rounded-xl py-2.5"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <PlayCircle size={16} color="#2B5BDB" />
        <Text
          className="text-sm text-cobalt-600 dark:text-cobalt-400"
          style={{ fontFamily: "GeneralSans-Semibold" }}
        >
          Start Simulation
        </Text>
      </TouchableOpacity>
    </View>
  );
}
