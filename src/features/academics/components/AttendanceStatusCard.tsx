import { useTheme } from "@/src/contexts/ThemeContext";
import { Check, Clock, X } from "lucide-react-native";
import { Text, View } from "react-native";

interface AttendanceStatusCardProps {
  status: string;
}

export function AttendanceStatusCard({ status }: AttendanceStatusCardProps) {
  const { isDark } = useTheme();
  const isPresent = status.toLowerCase() === "present";
  const isNotYetAvailable = status.toLowerCase() === "not yet available";

  const config = isPresent
    ? {
        bg: isDark ? "#064E3B" : "#ECFDF5",
        iconBg: isDark ? "#059669" : "#059669",
        text: isDark ? "#A7F3D0" : "#065F46",
        subtext: isDark ? "#34D399" : "#10B981",
        message: "You attended this class",
        icon: <Check size={22} color="#FFFFFF" />,
      }
    : isNotYetAvailable
    ? {
        bg: isDark ? "#1F2937" : "#F8FAFC",
        iconBg: isDark ? "#4B5563" : "#94A3B8",
        text: isDark ? "#E5E7EB" : "#1E2235",
        subtext: isDark ? "#9CA3AF" : "#94A3B8",
        message: "",
        icon: <Clock size={22} color="#FFFFFF" />,
      }
    : {
        bg: isDark ? "#500707" : "#FEF2F2",
        iconBg: isDark ? "#991B1B" : "#DC2626",
        text: isDark ? "#FECACA" : "#991B1B",
        subtext: isDark ? "#F87171" : "#EF4444",
        message: "You missed this class",
        icon: <X size={22} color="#FFFFFF" />,
      };

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
        Attendance Status
      </Text>
      <View
        className="flex-row items-center justify-between rounded-xl p-3"
        style={{ backgroundColor: config.bg }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: config.iconBg }}
          >
            {config.icon}
          </View>
          <View>
            <Text
              className="text-lg font-display"
              style={{ color: config.text }}
            >
              {status}
            </Text>
            {config.message !== "" && (
              <Text
                className="text-sm font-sans"
                style={{ color: config.subtext }}
              >
                {config.message}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
