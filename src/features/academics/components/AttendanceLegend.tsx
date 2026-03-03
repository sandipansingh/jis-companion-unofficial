import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

export function AttendanceLegend() {
  const { colors } = useTheme();
  const ITEMS = [
    { label: 'Present', bg: colors.successBg, border: colors.successStrong },
    { label: 'Partial', bg: colors.warningBg, border: colors.warningStrong },
    { label: 'Absent', bg: colors.dangerBg, border: colors.dangerStrong },
  ];
  return (
    <View className="flex-row justify-center gap-4 pt-3 border-t border-border">
      {ITEMS.map(({ label, bg, border }) => (
        <View key={label} className="flex-row items-center gap-1.5">
          <View
            className="w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: bg, borderColor: border }}
          />
          <Text className="text-[11px] font-sans" style={{ color: colors.textTertiary }}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
