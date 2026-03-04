import { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

interface HeroStat {
  label: string;
  value: string;
}

interface HeaderCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'hero';
  iconSize?: number;
  heroIconSize?: number;
  iconCircleSize?: number;
  stats?: HeroStat[];
  note?: string;
}

export function HeaderCard({
  title,
  description,
  icon: Icon,
  variant = 'default',
  iconSize = 40,
  heroIconSize = 28,
  iconCircleSize = 80,
  stats,
  note,
}: HeaderCardProps) {
  const { isDark, colors } = useTheme();
  const heroBg = isDark ? colors.ctaSoft : colors.cta;
  const heroText = isDark ? colors.text : colors.onCta;
  const heroSubText = isDark ? 'rgba(248,250,252,0.72)' : 'rgba(255,255,255,0.72)';
  const heroMutedText = isDark ? 'rgba(248,250,252,0.62)' : 'rgba(255,255,255,0.62)';
  const heroNoteText = isDark ? 'rgba(248,250,252,0.55)' : 'rgba(255,255,255,0.55)';

  if (variant === 'hero') {
    return (
      <View
        className="rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ backgroundColor: heroBg }}
      >
        <View
          className="absolute rounded-full w-40 h-40 -top-10 -right-[30px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        />

        <View
          className="absolute rounded-full w-[90px] h-[90px] -bottom-5 left-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        />

        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
          style={{
            backgroundColor: isDark ? 'rgba(248,250,252,0.16)' : 'rgba(255,255,255,0.15)',
          }}
        >
          <Icon size={heroIconSize} color={heroText} />
        </View>

        <Text className="font-sans-bold text-[22px] mb-1.5" style={{ color: heroText }}>
          {title}
        </Text>

        <Text
          style={{
            color: heroSubText,
            marginBottom: stats && stats.length > 0 ? 20 : 0,
          }}
          className="font-sans text-[13px] leading-5"
        >
          {description}
        </Text>

        {stats && stats.length > 0 && (
          <View className="flex-row gap-2">
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="flex-1 rounded-2xl items-center py-3"
                style={{
                  backgroundColor: isDark
                    ? 'rgba(248,250,252,0.12)'
                    : 'rgba(255,255,255,0.12)',
                }}
              >
                <Text className="font-sans-bold text-lg" style={{ color: heroText }}>
                  {stat.value}
                </Text>
                <Text
                  style={{ color: heroMutedText }}
                  className="font-sans text-[11px] mt-0.5"
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {note && (
          <Text
            style={{
              color: heroNoteText,
              marginTop: stats && stats.length > 0 ? 12 : 16,
            }}
            className="text-[11px] leading-4 italic"
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
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        className="rounded-3xl items-center justify-center mb-5"
        style={{
          width: iconCircleSize,
          height: iconCircleSize,
          backgroundColor: colors.ctaSoft,
        }}
      >
        <Icon size={iconSize} color={colors.cta} />
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
