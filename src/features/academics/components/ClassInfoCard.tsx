import { MapPin } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { FacultyInfo } from './FacultyInfo';
import { TimeBadge } from './TimeBadge';
import { TypeBadge } from './TypeBadge';

interface ClassInfoCardProps {
  subjectName: string;
  timeRange: string;
  classType: 'LAB' | 'THEORY';
  facultyName: string;
  location: string;
}

export function ClassInfoCard({
  subjectName,
  timeRange,
  classType,
  facultyName,
  location,
}: ClassInfoCardProps) {
  const { isDark, colors } = useTheme();

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
      <View className="flex-row justify-between items-center mb-4">
        <TimeBadge timeRange={timeRange} />
        <TypeBadge type={classType} />
      </View>

      <Text className="text-2xl text-ink-900 dark:text-white mb-1.5 leading-tight font-display">
        {subjectName}
      </Text>

      <View className="flex-row items-center gap-1.5 mb-1">
        <MapPin size={13} color={isDark ? colors.ink[400] : colors.ink[500]} />
        <Text className="text-sm text-ink-500 dark:text-ink-400 font-sans">
          {location}
        </Text>
      </View>

      <FacultyInfo facultyName={facultyName} />
    </View>
  );
}
