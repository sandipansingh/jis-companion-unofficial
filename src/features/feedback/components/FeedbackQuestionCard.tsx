import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles, spacing } from "@/src/styles/commonStyles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FeedbackQuestion } from "../api";
import { StarRating } from "./StarRating";

interface FeedbackQuestionCardProps {
  question: FeedbackQuestion;
  rating: number;
  onRatingChange: (value: number) => void;
}

export function FeedbackQuestionCard({
  question,
  rating,
  onRatingChange,
}: FeedbackQuestionCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        commonStyles.card,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            {question.head}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textMuted,
              },
            ]}
          >
            {question.subhead}
          </Text>
        </View>
      </View>

      <StarRating value={rating} onChange={onRatingChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
