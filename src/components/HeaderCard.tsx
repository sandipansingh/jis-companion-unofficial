import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

const HERO_BG_LIGHT = "#1B4FD8";
const HERO_BG_DARK = "#0A2672";

interface HeroStat {
  label: string;
  value: string;
}

interface HeaderCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "hero";
  iconSize?: number;
  iconCircleSize?: number;
  stats?: HeroStat[];
  note?: string;
}

export function HeaderCard({
  title,
  description,
  icon: Icon,
  variant = "default",
  iconSize = 40,
  iconCircleSize = 80,
  stats,
  note,
}: HeaderCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  if (variant === "hero") {
    return (
      <View
        className="rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ backgroundColor: isDark ? HERO_BG_DARK : HERO_BG_LIGHT }}
      >
        {/* Decorative circles */}
        <View
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 160,
            backgroundColor: "rgba(255,255,255,0.07)",
            top: -40,
            right: -30,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 90,
            height: 90,
            backgroundColor: "rgba(255,255,255,0.05)",
            bottom: -20,
            left: 20,
          }}
        />

        {/* Icon badge */}
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Icon size={iconSize === 40 ? 28 : iconSize} color="white" />
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: "ClashDisplay-Bold",
            color: "white",
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          {title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontFamily: "GeneralSans-Regular",
            color: "rgba(255,255,255,0.72)",
            fontSize: 13,
            lineHeight: 20,
            marginBottom: stats && stats.length > 0 ? 20 : 0,
          }}
        >
          {description}
        </Text>

        {/* Optional stats row */}
        {stats && stats.length > 0 && (
          <View className="flex-row gap-2">
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="flex-1 rounded-2xl items-center py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <Text
                  style={{
                    fontFamily: "ClashDisplay-Bold",
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontFamily: "GeneralSans-Regular",
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Optional note */}
        {note && (
          <Text
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 11,
              lineHeight: 16,
              fontStyle: "italic",
              marginTop: stats && stats.length > 0 ? 12 : 16,
            }}
          >
            {note}
          </Text>
        )}
      </View>
    );
  }

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
        <Icon size={iconSize} color={isDark ? "white" : "#1B4FD8"} />
      </View>
      <Text className="text-2xl text-ink-950 dark:text-white mb-2 text-center font-display">
        {title}
      </Text>
      <Text className="text-sm text-ink-600 dark:text-ink-400 text-center leading-5 font-sans">
        {description}
      </Text>
      {note && (
        <Text className="text-xs text-ink-500 dark:text-ink-400 text-center leading-4 mt-2 italic">
          {note}
        </Text>
      )}
    </View>
  );
}
