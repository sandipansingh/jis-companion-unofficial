import { Button, Header } from "@/src/components";
import { useAlertStore } from "@/src/store/alertStore";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { FacultyHeroCard, FeedbackQuestionCard } from "../components";
import { useFacultyRating } from "../hooks";
import { parseFacultyId } from "../utils/facultyId";

export default function FacultyRatingScreen() {
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
    handleSubmitFeedback,
    handleSkipFeedback,
    updateRating,
  } = useFacultyRating({
    facCode: parsed?.facCode || null,
    subCode: parsed?.subCode || null,
    secId: parsed?.secId || null,
    onSuccess: () => {
      showAlert({ title: "Success", message: "Feedback submitted successfully!" });
    },
    onError: (message) => {
      showAlert({ title: "Error", message });
      if (message === "Failed to load faculty information") {
        router.back();
      }
    },
  });

  const handleSaveFeedback = async () => {
    if (!faculty) return;
    const result = await handleSubmitFeedback();
    if (!result.success && result.error) {
      showAlert({ title: "Incomplete", message: result.error });
    }
  };

  const handleNotOpted = async () => {
    if (!faculty) return;
    await handleSkipFeedback();
  };

  return (
    <View className="flex-1 bg-base">
      <Header
        title={loadingFaculty || !faculty ? "Loading..." : faculty.fac_name}
        showBackButton
      />

      {loadingFaculty || !faculty ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#2B5BDB" />
          <Text
            className="text-sm text-ink-500 font-sans"
          >
            Loading faculty information...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
          <FacultyHeroCard faculty={faculty} />

          {loadingQuestions ? (
            <View className="items-center justify-center py-16 gap-3">
              <ActivityIndicator size="large" color="#2B5BDB" />
              <Text
                className="text-sm text-ink-500 font-sans"
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
                  rating={ratings[question.id] ?? 0}
                  onRatingChange={(value) => updateRating(question.id, value)}
                />
              ))}

              <View className="pt-6 gap-3">
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
                  variant="secondary"
                />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
