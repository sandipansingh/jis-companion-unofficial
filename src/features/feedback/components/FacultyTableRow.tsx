import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { FacultyFeedbackItem } from '../types';
import { FacultyAvatar } from './FacultyAvatar';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';

interface FacultyTableRowProps {
  faculty: FacultyFeedbackItem;
  onPress: () => void;
  isLast: boolean;
}

/**
 * A table-row representation of a faculty feedback item, used on the desktop web layout.
 */
export function FacultyTableRow({ faculty, onPress, isLast }: FacultyTableRowProps) {
  const { colors, isDark } = useTheme();

  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-3.5 px-4 py-[13px] web:cursor-pointer web:transition-colors web:duration-150"
        style={({ hovered, pressed }: any) => ({
          backgroundColor:
            hovered || pressed
              ? isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.025)'
              : 'transparent',
        })}
        accessibilityRole="button"
      >
        <FacultyAvatar
          imageUrl={faculty.fac_image}
          shortName={faculty.fac_sht_name}
          size={40}
        />
        <View className="flex-1">
          <Text
            className="text-[14px] mb-0.5 font-sans-semi"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {faculty.fac_name}
          </Text>
          <Text
            className="text-xs font-sans"
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
          >
            {faculty.sub_name}
          </Text>
        </View>
        <View className="px-2 py-[3px] rounded-md bg-ink-100 dark:bg-ink-800">
          <Text
            className="text-[11px] font-sans-md"
            style={{ color: colors.textSecondary }}
          >
            {faculty.sub_code}
          </Text>
        </View>
        <FeedbackStatusBadge totalRating={faculty.totalRating} />
      </Pressable>
      {!isLast && <View className="h-px mx-4 bg-border" />}
    </>
  );
}
