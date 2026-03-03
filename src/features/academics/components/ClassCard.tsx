import { Clock, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { SubjectWiseAttendance } from '../types';

interface ClassCardProps {
  classData: SubjectWiseAttendance;
  time: string;
  isFallback?: boolean;
  onPress?: () => void;
}

export function ClassCard({
  classData,
  time,
  isFallback = false,
  onPress,
}: ClassCardProps) {
  const { colors } = useTheme();
  const subjectParts = classData.subject_name.split(' - ');
  const subjectCode = subjectParts[0]?.trim();
  const subjectName = subjectParts[1]?.trim() || classData.subject_name;

  return (
    <TouchableOpacity
      className="bg-surface rounded-2xl border border-border p-4 mb-3"
      style={{
        opacity: isFallback ? 0.75 : 1,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-cobalt-50 border border-border rounded-full px-3 py-1">
          <Text className="text-[11px] text-cobalt-600 font-sans-semi">
            {subjectCode}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Clock size={12} color={colors.textTertiary} />
          <Text className="text-xs text-ink-500 font-sans">{time}</Text>
        </View>
      </View>

      <Text
        className={`text-base text-ink-900 mb-2 leading-snug font-sans-semi ${isFallback ? 'italic' : 'not-italic'}`}
        numberOfLines={2}
      >
        {subjectName}
      </Text>

      <View className="flex-row items-center gap-1.5">
        <User size={12} color={colors.textTertiary} />
        <Text className="text-xs text-ink-500 font-sans" numberOfLines={1}>
          {classData.faculty}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
