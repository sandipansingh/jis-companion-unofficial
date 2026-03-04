import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { FeedbackQuestion } from '../types';
import { StarRating } from './StarRating';

interface FacultyQuestionTableRowProps {
  question: FeedbackQuestion;
  rating: number;
  onRatingChange: (value: number) => void;
  isLast: boolean;
}

/**
 * A table-row representation of a feedback question with an inline star rating.
 * Used on the desktop web layout of FacultyRatingScreen.
 */
export function FacultyQuestionTableRow({
  question,
  rating,
  onRatingChange,
  isLast,
}: FacultyQuestionTableRowProps) {
  const { colors } = useTheme();

  return (
    <>
      <View className="flex-col px-4 py-[14px] gap-[10px]">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              style={{ color: colors.text }}
              className="text-[13px] leading-[19px] mb-0.5 font-sans-md"
            >
              {question.head}
            </Text>
            {question.subhead ? (
              <Text
                style={{ color: colors.textSecondary }}
                className="text-[11px] leading-4 font-sans"
              >
                {question.subhead}
              </Text>
            ) : null}
          </View>
          <Text
            style={{
              color: rating > 0 ? colors.text : colors.textSecondary,
              flexShrink: 0,
            }}
            className="text-[11px] mt-0.5 font-sans-md"
          >
            {rating > 0 ? `${rating} / 10` : '—'}
          </Text>
        </View>
        <StarRating value={rating} onChange={onRatingChange} />
      </View>
      {!isLast && <View className="h-px bg-border mx-4" />}
    </>
  );
}
