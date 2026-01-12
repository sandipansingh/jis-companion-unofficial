import { Button } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { commonStyles, spacing } from "@/src/styles/commonStyles";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FacultyHeroCard, FeedbackQuestionCard } from "../components";
import { useFacultyRating } from "../hooks";
import { parseFacultyId } from "../utils/facultyId";

export default function FacultyRatingScreen() {
  const { colors } = useTheme();
  const { showAlert } = useAlertStore();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const parsed = id ? parseFacultyId(id) : null;

  const {
    faculty,
    feedbackQuestions,
    ratings,
    loadingFaculty,
    loadingQuestions,
    submittingFeedback,
    skippingFeedback,
    isReady,
    handleSubmitFeedback,
    handleSkipFeedback,
    updateRating,
  } = useFacultyRating({
    facCode: parsed?.facCode || null,
    subCode: parsed?.subCode || null,
    secId: parsed?.secId || null,
    onSuccess: () => {
      showAlert({
        title: "Success",
        message: "Feedback submitted successfully!",
      });
      router.back();
    },
    onError: (message) => {
      showAlert({
        title: "Error",
        message,
      });
      if (message === "Failed to load faculty information") {
        router.back();
      }
    },
  });

  const handleSaveFeedback = async () => {
    if (!faculty) return;

    showAlert({
      title: "Submit Feedback",
      message: `Are you sure you want to submit feedback for ${faculty.fac_name}?`,
      showCancel: true,
      confirmText: "Submit",
      onConfirm: async () => {
        const result = await handleSubmitFeedback();
        if (!result.success && result.error) {
          showAlert({
            title: "Incomplete",
            message: result.error,
          });
        }
      },
    });
  };

  const handleNotOpted = async () => {
    if (!faculty) return;

    showAlert({
      title: "Skip Feedback",
      message: `Do you want to skip giving feedback for ${faculty.fac_name}?`,
      showCancel: true,
      confirmText: "Confirm",
      onConfirm: async () => {
        await handleSkipFeedback();
      },
    });
  };

  if (loadingFaculty || !faculty) {
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
            Loading...
          </Text>
          <View style={commonStyles.placeholder} />
        </View>
        <View style={commonStyles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              commonStyles.loadingText,
              { color: colors.textSecondary, marginTop: spacing.md },
            ]}
          >
            Loading faculty information...
          </Text>
        </View>
      </View>
    );
  }

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
          {faculty.fac_name}
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
      >
        <FacultyHeroCard faculty={faculty} />

        {/* Loading Questions */}
        {loadingQuestions ? (
          <View style={[commonStyles.centerContainer, { paddingVertical: 60 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                commonStyles.loadingText,
                { color: colors.textSecondary },
              ]}
            >
              Loading questions...
            </Text>
          </View>
        ) : (
          <>
            {feedbackQuestions.map((question) => (
              <FeedbackQuestionCard
                key={question.id}
                question={question}
                rating={ratings[question.id] || 10}
                onRatingChange={(value) => updateRating(question.id, value)}
              />
            ))}

            <View style={{ paddingTop: spacing.lg, gap: spacing.md }}>
              <Button
                title="Submit Feedback"
                onPress={handleSaveFeedback}
                disabled={submittingFeedback || skippingFeedback}
                loading={submittingFeedback}
              />

              <Button
                title="Skip Feedback"
                onPress={handleNotOpted}
                disabled={submittingFeedback || skippingFeedback}
                loading={skippingFeedback}
                style={{
                  backgroundColor: colors.surface,
                }}
                textStyle={{ color: colors.textSecondary }}
              />
            </View>
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
});
