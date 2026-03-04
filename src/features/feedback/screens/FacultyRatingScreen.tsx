import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { Button, Header } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useAlertStore } from '@/src/store/alertStore';

import {
  FacultyAvatar,
  FacultyHeroCard,
  FacultyQuestionTableRow,
  FeedbackQuestionCard,
} from '../components';
import { useFacultyRating } from '../hooks';
import { parseFacultyId } from '../utils/facultyId';

export default function FacultyRatingScreen() {
  const { showAlert } = useAlertStore();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
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
      showAlert({ title: 'Success', message: 'Feedback submitted successfully!' });
    },
    onError: (message) => {
      showAlert({ title: 'Error', message });
      if (message === 'Failed to load faculty information') {
        router.back();
      }
    },
  });

  const handleSaveFeedback = async () => {
    if (!faculty) return;
    const result = await handleSubmitFeedback();
    if (!result.success && result.error) {
      showAlert({ title: 'Incomplete', message: result.error });
    }
  };

  const handleNotOpted = async () => {
    if (!faculty) return;
    await handleSkipFeedback();
  };

  const answeredCount = feedbackQuestions.filter((q) => (ratings[q.id] ?? 0) > 0).length;
  const totalCount = feedbackQuestions.length;

  return (
    <View className="flex-1 bg-base">
      {isDesktopWeb ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={900}>
            <Header title="Faculty Rating" showBackButton fallbackRoute="/feedback" />

            {loadingFaculty || !faculty ? (
              <View className="py-[100px] gap-3 items-center">
                <ActivityIndicator size="large" color={colors.textSecondary} />
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-[13px] font-sans"
                >
                  Loading faculty information...
                </Text>
              </View>
            ) : (
              <>
                <View className="bg-surface flex-row items-center rounded-[14px] border border-border p-5 gap-4 mb-7">
                  <FacultyAvatar
                    imageUrl={faculty.fac_image}
                    shortName={faculty.fac_sht_name}
                    size={56}
                  />
                  <View className="flex-1">
                    <Text
                      style={{ color: colors.text }}
                      className="text-[17px] mb-1 font-sans-bold"
                    >
                      {faculty.fac_name}
                    </Text>
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-[13px] mb-0.5 font-sans"
                    >
                      {faculty.sub_name}
                    </Text>
                    <View className="px-2 py-[3px] rounded-[6px] self-start bg-ink-100 dark:bg-ink-800">
                      <Text
                        style={{ color: colors.textSecondary }}
                        className="text-[11px] font-sans-md"
                      >
                        {faculty.sub_code}
                      </Text>
                    </View>
                  </View>

                  {!loadingQuestions && totalCount > 0 && (
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor:
                          answeredCount === totalCount
                            ? 'rgba(34,197,94,0.12)'
                            : 'rgba(234,179,8,0.12)',
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor:
                          answeredCount === totalCount ? colors.success : colors.warning,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color:
                            answeredCount === totalCount
                              ? colors.success
                              : colors.warning,
                        }}
                        className="font-sans-semi"
                      >
                        {answeredCount}/{totalCount} answered
                      </Text>
                    </View>
                  )}
                </View>

                {loadingQuestions ? (
                  <View className="py-[60px] gap-3 items-center">
                    <ActivityIndicator size="large" color={colors.textSecondary} />
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-[13px] font-sans"
                    >
                      Loading questions...
                    </Text>
                  </View>
                ) : (
                  <>
                    {feedbackQuestions.length > 0 && (
                      <>
                        <Text
                          style={{
                            color: colors.textTertiary ?? colors.textSecondary,
                            letterSpacing: 0.9,
                          }}
                          className="text-[10px] uppercase mb-2 px-0.5 font-sans-semi"
                        >
                          Questions
                        </Text>
                        <View className="bg-surface overflow-hidden rounded-[14px] border border-border mb-6">
                          {feedbackQuestions.map((question, i) => (
                            <FacultyQuestionTableRow
                              key={question.id}
                              question={question}
                              rating={ratings[question.id] ?? 0}
                              onRatingChange={(value) => updateRating(question.id, value)}
                              isLast={i === feedbackQuestions.length - 1}
                            />
                          ))}
                        </View>
                      </>
                    )}

                    <View className="flex-row justify-end gap-[10px]">
                      <View className="min-w-[140px]">
                        <Button
                          title="Skip Feedback"
                          onPress={handleNotOpted}
                          disabled={submittingFeedback || skippingFeedback}
                          loading={skippingFeedback}
                          variant="secondary"
                        />
                      </View>
                      <View className="min-w-[160px]">
                        <Button
                          title="Submit Feedback"
                          onPress={handleSaveFeedback}
                          disabled={submittingFeedback || skippingFeedback}
                          loading={submittingFeedback}
                        />
                      </View>
                    </View>
                  </>
                )}
              </>
            )}
          </ContentContainer>
        </ScrollView>
      ) : (
        <>
          <Header
            title={loadingFaculty || !faculty ? 'Loading...' : faculty.fac_name}
            showBackButton
          />

          {loadingFaculty || !faculty ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={colors.textSecondary} />
              <Text className="text-sm text-ink-500 font-sans">
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
                  <ActivityIndicator size="large" color={colors.textSecondary} />
                  <Text className="text-sm text-ink-500 font-sans">
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
        </>
      )}
    </View>
  );
}
