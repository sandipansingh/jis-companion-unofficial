import { Text, View } from "react-native";
import { FeedbackQuestion } from "../api";
import { StarRating } from "./StarRating";

interface FeedbackQuestionCardProps {
  question: FeedbackQuestion;
  rating: number;
  onRatingChange: (value: number) => void;
}

export function FeedbackQuestionCard({ question, rating, onRatingChange }: FeedbackQuestionCardProps) {
  return (
    <View
      className="bg-surface dark:bg-ink-900 rounded-2xl border border-border p-4 mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="mb-4">
        <Text
          className="text-sm text-ink-900 dark:text-white leading-snug mb-1"
          style={{ fontFamily: 'GeneralSans-Semibold' }}
        >
          {question.head}
        </Text>
        <Text
          className="text-xs text-ink-500 dark:text-ink-400"
          style={{ fontFamily: 'GeneralSans-Regular' }}
        >
          {question.subhead}
        </Text>
      </View>
      <StarRating value={rating} onChange={onRatingChange} />
    </View>
  );
}
