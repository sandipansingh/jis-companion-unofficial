import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { ExperimentCard } from './ExperimentCard';

interface Experiment {
  sl: string;
  subject_code?: string;
  experiment: string;
  link: string;
}

interface ExperimentGroupProps {
  subjectCode: string;
  experiments: Experiment[];
  onExperimentPress: (link: string) => void;
  /** Number of columns to use for the card grid (web only) */
  columns?: number;
  isDesktopWeb?: boolean;
}

export function ExperimentGroup({
  subjectCode,
  experiments,
  onExperimentPress,
  columns = 2,
  isDesktopWeb = false,
}: ExperimentGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  const GAP = 16;
  const cardWidth =
    columns === 3
      ? (`calc(${(100 / 3).toFixed(4)}% - ${((GAP * (columns - 1)) / columns).toFixed(4)}px)` as any)
      : (`calc(50% - ${GAP / 2}px)` as any);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between bg-surface dark:bg-surface border border-border px-4 py-3"
        style={{
          borderRadius: expanded ? 0 : 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomWidth: expanded ? 0 : 1,
        }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="border border-border rounded-xl px-3 py-1"
            style={{ backgroundColor: colors.ctaSoft }}
          >
            <Text className="text-sm font-sans-semi" style={{ color: colors.cta }}>
              {subjectCode}
            </Text>
          </View>
          <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
            {experiments.length} experiment{experiments.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {expanded ? (
          <ChevronDown size={18} color={colors.textSecondary} />
        ) : (
          <ChevronRight size={18} color={colors.textSecondary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View
          className="border border-border p-4 bg-base dark:bg-base"
          style={{
            borderTopWidth: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          {isDesktopWeb ? (
            <View className="flex-row flex-wrap gap-4">
              {experiments.map((item, index) => (
                <View key={`${item.sl}-${index}`} style={{ width: cardWidth }}>
                  <ExperimentCard
                    serialNumber={item.sl}
                    subjectCode={item.subject_code}
                    experimentName={item.experiment}
                    onPress={() => onExperimentPress(item.link)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View>
              {experiments.map((item, index) => (
                <ExperimentCard
                  key={`${item.sl}-${index}`}
                  serialNumber={item.sl}
                  subjectCode={item.subject_code}
                  experimentName={item.experiment}
                  onPress={() => onExperimentPress(item.link)}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
