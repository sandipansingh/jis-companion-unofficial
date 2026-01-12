import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles, spacing } from "@/src/styles/commonStyles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FacultyFeedbackItem } from "../api";
import { FacultyAvatar } from "./FacultyAvatar";

interface FacultyHeroCardProps {
  faculty: FacultyFeedbackItem;
}

export function FacultyHeroCard({ faculty }: FacultyHeroCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        commonStyles.card,
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <FacultyAvatar
        imageUrl={faculty.fac_image}
        name={faculty.fac_name}
        size={80}
      />

      <Text style={[styles.name, { color: colors.text }]}>
        {faculty.fac_name}
      </Text>

      <Text
        style={[
          styles.code,
          {
            color: colors.textMuted,
          },
        ]}
      >
        {faculty.sub_code}
      </Text>

      <Text
        style={[
          styles.subject,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {faculty.sub_name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: spacing.sm,
  },
  code: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: spacing.xs,
  },
  subject: {
    fontSize: 14,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
