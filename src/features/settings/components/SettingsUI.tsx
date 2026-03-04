import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface SettingsSectionLabelProps {
  label: string;
}

export function SettingsSectionLabel({ label }: SettingsSectionLabelProps) {
  const { colors } = useTheme();
  return (
    <Text
      className="text-[10px] font-semibold tracking-[0.9px] uppercase mb-1.5 px-0.5 font-sans"
      style={{ color: colors.textTertiary ?? colors.textSecondary }}
    >
      {label}
    </Text>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  label,
  description,
  control,
  isFirst,
  isLast,
}: SettingsRowProps) {
  const { isDark } = useTheme();

  return (
    <Pressable
      style={({ hovered }: any) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: hovered
          ? isDark
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(0,0,0,0.02)'
          : 'transparent',
        borderTopLeftRadius: isFirst ? 14 : 0,
        borderTopRightRadius: isFirst ? 14 : 0,
        borderBottomLeftRadius: isLast ? 14 : 0,
        borderBottomRightRadius: isLast ? 14 : 0,
        cursor: 'default' as any,
        transition: 'background-color 150ms ease',
      })}
    >
      <View className="flex-1 mr-5">
        <Text className="text-sm font-medium text-text leading-5 font-sans">{label}</Text>
        {description ? (
          <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-[17px] font-sans">
            {description}
          </Text>
        ) : null}
      </View>
      <View className="items-end justify-center">{control}</View>
    </Pressable>
  );
}

interface SettingsSectionProps {
  title: string;
  rows: React.ReactNode[];
}

export function SettingsSection({ title, rows }: SettingsSectionProps) {
  return (
    <View className="mb-7">
      <SettingsSectionLabel label={title} />
      <View className="rounded-[14px] border border-border overflow-hidden bg-surface">
        {rows.map((row, i) =>
          i < rows.length - 1 ? (
            <View key={i}>
              {row}
              <View className="h-px bg-border mx-4" />
            </View>
          ) : (
            <View key={i}>{row}</View>
          ),
        )}
      </View>
    </View>
  );
}
