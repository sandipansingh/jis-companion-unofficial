import { Button } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { commonStyles, spacing } from "@/src/styles/commonStyles";
import { router } from "expo-router";
import { AlertCircle, ChevronLeft, Clipboard, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FacultyFeedbackItem } from "../api";
import { FacultyListItem, ProgressCard } from "../components";
import { useFeedbackData } from "../hooks";
import { useFeedbackStore } from "../store";
import { createFacultyId } from "../utils/facultyId";

export default function FacultyListScreen() {
  const { colors } = useTheme();
  const { showAlert } = useAlertStore();
  const { setSelectedFaculty } = useFeedbackStore();
  const {
    lockStatus,
    facultyList,
    loading,
    error,
    isFeedbackLocked,
    submittingFinal,
    handleFinalSubmit: submitAllFeedback,
    getProgressStats,
    refreshFeedback,
  } = useFeedbackData();

  const [showConfirmLock, setShowConfirmLock] = useState(false);

  const handleRateFaculty = (faculty: FacultyFeedbackItem) => {
    if (isFeedbackLocked) return;

    setSelectedFaculty(faculty);

    const facultyId = createFacultyId(
      faculty.fac_code,
      faculty.sub_code,
      faculty.sec_id
    );
    router.push(`/feedback/faculty/${facultyId}` as any);
  };

  const handleSubmitAllFeedback = async () => {
    const result = await submitAllFeedback();
    if (result.success) {
      showAlert({
        title: "Success",
        message: "All feedback submitted successfully!",
      });
      setShowConfirmLock(false);
    } else {
      showAlert({
        title: "Error",
        message: result.error || "Failed to finalize feedback",
      });
    }
  };

  const {
    totalCount,
    submittedCount,
    notOptedCount,
    pendingCount,
    progressPercentage,
  } = getProgressStats();

  // Locked State View
  if (isFeedbackLocked) {
    return (
      <View
        style={[commonStyles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={commonStyles.backButton}
          >
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
            Faculty Feedback
          </Text>
          <View style={commonStyles.placeholder} />
        </View>

        <View
          style={[
            commonStyles.centerContainer,
            { paddingHorizontal: spacing.lg },
          ]}
        >
          <View style={styles.lockedCard}>
            <View style={styles.lockedIconContainer}>
              <Lock size={40} color={colors.textMuted} />
            </View>
            <Text style={[styles.lockedTitle, { color: colors.text }]}>
              Feedback Locked
            </Text>
            <Text
              style={[styles.lockedMessage, { color: colors.textSecondary }]}
            >
              Your feedback has been submitted successfully.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Main Faculty List View
  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={commonStyles.backButton}
        >
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Faculty Feedback
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
      >
        {loading ? (
          <View style={[commonStyles.centerContainer, { paddingVertical: 60 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                commonStyles.loadingText,
                { color: colors.textSecondary },
              ]}
            >
              Loading...
            </Text>
          </View>
        ) : error ? (
          <View style={[commonStyles.centerContainer, { paddingVertical: 60 }]}>
            <AlertCircle size={48} color={colors.error} />
            <Text
              style={[
                commonStyles.errorText,
                { color: colors.error, marginTop: spacing.md },
              ]}
            >
              {error}
            </Text>
            <Button
              title="Retry"
              onPress={refreshFeedback}
              fullWidth={false}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                height: "auto",
              }}
              textStyle={{
                fontSize: 14,
              }}
            />
          </View>
        ) : (
          <>
            {/* Progress Card */}
            {totalCount > 0 && (
              <ProgressCard
                submittedCount={submittedCount}
                pendingCount={pendingCount}
                notOptedCount={notOptedCount}
                progressPercentage={progressPercentage}
              />
            )}

            {/* Faculty List */}
            {facultyList.length === 0 ? (
              <View
                style={[commonStyles.centerContainer, { paddingVertical: 60 }]}
              >
                <Clipboard size={48} color={colors.textMuted} />
                <Text
                  style={[
                    commonStyles.emptyText,
                    { color: colors.textSecondary, marginTop: spacing.md },
                  ]}
                >
                  No feedback available
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {facultyList.map((faculty) => (
                  <FacultyListItem
                    key={`${faculty.fac_code}-${faculty.sub_id}-${faculty.sec_id}`}
                    faculty={faculty}
                    onPress={() => handleRateFaculty(faculty)}
                  />
                ))}
              </View>
            )}

            {/* Final Submit Section */}
            {totalCount > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                {showConfirmLock ? (
                  <View
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      padding: spacing.md,
                      borderRadius: 16,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: spacing.sm,
                      }}
                    >
                      Finalize & Submit All Feedback?
                    </Text>
                    <View style={{ flexDirection: "row", gap: spacing.sm }}>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Cancel"
                          variant="secondary"
                          onPress={() => setShowConfirmLock(false)}
                          disabled={submittingFinal}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Confirm"
                          onPress={handleSubmitAllFeedback}
                          disabled={submittingFinal}
                          loading={submittingFinal}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <Button
                    title={
                      progressPercentage < 100
                        ? "Complete All to Submit"
                        : "Final Submit"
                    }
                    onPress={() => setShowConfirmLock(true)}
                    disabled={progressPercentage < 100}
                    icon={
                      <Lock
                        size={16}
                        color={
                          progressPercentage < 100
                            ? colors.textMuted
                            : colors.buttonText
                        }
                      />
                    }
                    iconPosition="right"
                    style={{
                      paddingVertical: spacing.md,
                      backgroundColor:
                        progressPercentage < 100
                          ? colors.backgroundSecondary
                          : colors.primary,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      height: "auto",
                    }}
                    textStyle={{
                      color:
                        progressPercentage < 100
                          ? colors.textMuted
                          : colors.buttonText,
                    }}
                  />
                )}
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    color: colors.textMuted,
                    marginTop: spacing.md,
                  }}
                >
                  Once submitted, feedback cannot be edited.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  lockedCard: {
    backgroundColor: "transparent",
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  lockedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  lockedMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
});
