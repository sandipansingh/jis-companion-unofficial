import { useTheme } from "@/src/contexts/ThemeContext";
import { spacing } from "@/src/styles/commonStyles";
import { CheckCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FeedbackStatusBadgeProps {
  totalRating: number;
}

export function FeedbackStatusBadge({ totalRating }: FeedbackStatusBadgeProps) {
  const { colors } = useTheme();

  if (totalRating === -10) {
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: colors.textMuted,
            },
          ]}
        >
          Skipped
        </Text>
      </View>
    );
  }

  if (totalRating > 0) {
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.greenLight,
            flexDirection: "row",
            gap: 4,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: colors.greenDark,
            },
          ]}
        >
          Done
        </Text>
        <CheckCircle size={12} color={colors.greenDark} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.warningLight,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: colors.warning,
          },
        ]}
      >
        Pending
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
