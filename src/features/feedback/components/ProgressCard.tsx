import { useTheme } from "@/src/contexts/ThemeContext";
import { spacing } from "@/src/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressCardProps {
  submittedCount: number;
  pendingCount: number;
  notOptedCount: number;
  progressPercentage: number;
}

export function ProgressCard({
  submittedCount,
  pendingCount,
  notOptedCount,
  progressPercentage,
}: ProgressCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.decorativeCircle,
          styles.topRightCircle,
          { backgroundColor: colors.primary + "10" },
        ]}
      />
      <View
        style={[
          styles.decorativeCircle,
          styles.bottomLeftCircle,
          { backgroundColor: colors.accent + "10" },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Your Progress
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Complete feedback for all subjects
          </Text>
        </View>
        <Text style={[styles.percentage, { color: colors.primary }]}>
          {progressPercentage}%
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.success + "10",
              borderColor: colors.success + "20",
            },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.successDark }]}>
            {submittedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.success }]}>
            DONE
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.warning + "10",
              borderColor: colors.warning + "20",
            },
          ]}
        >
          <Text
            style={[styles.statValuePending, { color: colors.warningDark }]}
          >
            {pendingCount}
          </Text>
          <Text style={[styles.statLabelPending, { color: colors.warning }]}>
            PENDING
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.statValueNeutral, { color: colors.text }]}>
            {notOptedCount}
          </Text>
          <Text style={[styles.statLabelNeutral, { color: colors.textMuted }]}>
            SKIPPED
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    overflow: "hidden",
  },
  decorativeCircle: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  topRightCircle: {
    top: -40,
    right: -40,
  },
  bottomLeftCircle: {
    bottom: -40,
    left: -40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  percentage: {
    fontSize: 32,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.lg,
    zIndex: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statValuePending: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statValueNeutral: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statLabelPending: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statLabelNeutral: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  progressBarContainer: {
    height: 12,
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    zIndex: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
});
