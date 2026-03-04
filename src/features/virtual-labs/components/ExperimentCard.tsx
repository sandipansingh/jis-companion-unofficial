import { FlaskConical, PlayCircle } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

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
  const { colors } = useTheme();
  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <View
          className="w-10 h-10 rounded-xl border border-border items-center justify-center"
          style={{ backgroundColor: colors.ctaSoft }}
        >
          <FlaskConical size={18} color={colors.cta} />
        </View>
        <View className="flex-1 gap-1">
          <View className="bg-ink-100 dark:bg-ink-800 rounded-full px-2.5 py-0.5 self-start">
            <Text className="text-[10px] text-ink-500 dark:text-ink-300 font-sans-md">
              #{serialNumber}
            </Text>
          </View>
          {subjectCode && (
            <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
              {subjectCode}
            </Text>
          )}
        </View>
      </View>

      <Text className="text-base text-ink-900 dark:text-white leading-snug mb-3 font-sans-semi">
        {experimentName}
      </Text>

      <TouchableOpacity
        className="flex-row items-center justify-center gap-2 rounded-xl py-2.5"
        style={{ backgroundColor: colors.ctaSoft }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <PlayCircle size={16} color={colors.cta} />
        <Text className="text-sm font-sans-semi" style={{ color: colors.cta }}>
          Start Simulation
        </Text>
      </TouchableOpacity>
    </View>
  );
}
