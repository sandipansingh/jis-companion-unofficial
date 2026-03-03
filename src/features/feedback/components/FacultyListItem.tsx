import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { FacultyFeedbackItem } from '../types';
import { FacultyAvatar } from './FacultyAvatar';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

interface FacultyListItemProps {
  faculty: FacultyFeedbackItem;
  onPress: (faculty: FacultyFeedbackItem) => void;
}

export function FacultyListItem({ faculty, onPress }: FacultyListItemProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 flex-row items-center gap-4"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={() => onPress(faculty)}
      activeOpacity={0.8}
    >
      <FacultyAvatar
        imageUrl={faculty.fac_image}
        shortName={faculty.fac_sht_name}
        size={48}
      />

      <View className="flex-1 gap-0.5">
        <Text
          className="text-base text-ink-900 dark:text-white font-sans-semi"
          numberOfLines={1}
        >
          {faculty.fac_name}
        </Text>
        <Text
          className="text-xs text-ink-500 dark:text-ink-400 font-sans"
          numberOfLines={1}
        >
          {faculty.sub_name}
        </Text>
        <View className="bg-ink-100 dark:bg-ink-800 rounded-full px-2 py-0.5 self-start mt-1">
          <Text className="text-[10px] text-ink-500 dark:text-ink-300 font-sans-md">
            {faculty.sub_code}
          </Text>
        </View>
      </View>

      <FeedbackStatusBadge totalRating={faculty.totalRating} />
    </TouchableOpacity>
  );
}
