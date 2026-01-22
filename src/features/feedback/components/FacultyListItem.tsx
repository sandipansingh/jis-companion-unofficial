import { useTheme } from "@/src/contexts/ThemeContext";
import { spacing } from "@/src/styles/commonStyles";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FacultyFeedbackItem } from "../api";
import { FacultyAvatar } from "./FacultyAvatar";
import { FeedbackStatusBadge } from "./FeedbackStatusBadge";

interface FacultyListItemProps {
  faculty: FacultyFeedbackItem;
  onPress: (faculty: FacultyFeedbackItem) => void;
}

export function FacultyListItem({ faculty, onPress }: FacultyListItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(faculty)}
    >
      <FacultyAvatar
        imageUrl={faculty.fac_image}
        shortName={faculty.fac_sht_name}
        size={48}
      />

      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {faculty.fac_name}
        </Text>
        <Text
          style={[
            styles.subject,
            {
              color: colors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {faculty.sub_name}
        </Text>
        <View
          style={[
            styles.subCodeBox,
            {
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.subCode,
              {
                color: colors.textMuted,
              },
            ]}
          >
            {faculty.sub_code}
          </Text>
        </View>
      </View>

      <FeedbackStatusBadge totalRating={faculty.totalRating} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
  },
  subject: {
    fontSize: 13,
    fontWeight: "400",
  },
  subCodeBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
  },
  subCode: {
    fontSize: 11,
    fontWeight: "500",
  },
});
