import { router } from 'expo-router';
import { AlertCircle, Clipboard, Lock } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button, Header } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useAlertStore } from '@/src/store/alertStore';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import {
  FacultyAvatar,
  FacultyListItem,
  FeedbackStatusBadge,
  ProgressCard,
} from '../components';
import { useFeedbackData } from '../hooks';
import { useFeedbackStore } from '../store';
import { FacultyFeedbackItem } from '../types';
import { createFacultyId } from '../utils/facultyId';

interface DesktopFacultyRowProps {
  faculty: FacultyFeedbackItem;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
  isLast: boolean;
}

function DesktopFacultyRow({
  faculty,
  onPress,
  colors,
  isDark,
  isLast,
}: DesktopFacultyRowProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-3.5 px-4 py-[13px]"
        style={({ hovered, pressed }: any) => ({
          backgroundColor:
            hovered || pressed
              ? isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.025)'
              : 'transparent',
          cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
          transition: Platform.OS === 'web' ? 'background-color 150ms ease' : undefined,
        })}
        accessibilityRole="button"
      >
        <FacultyAvatar
          imageUrl={faculty.fac_image}
          shortName={faculty.fac_sht_name}
          size={40}
        />
        <View className="flex-1">
          <Text
            className="text-[14px] mb-0.5 font-sans-semi"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {faculty.fac_name}
          </Text>
          <Text
            className="text-xs font-sans"
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
          >
            {faculty.sub_name}
          </Text>
        </View>
        <View className="px-2 py-[3px] rounded-md bg-ink-100 dark:bg-ink-800">
          <Text
            className="text-[11px] font-sans-md"
            style={{ color: colors.textSecondary }}
          >
            {faculty.sub_code}
          </Text>
        </View>
        <FeedbackStatusBadge totalRating={faculty.totalRating} />
      </Pressable>
      {!isLast && <View className="h-px mx-4 bg-border" />}
    </>
  );
}

interface DesktopProgressBarProps {
  progressPercentage: number;
  submittedCount: number;
  pendingCount: number;
  notOptedCount: number;
  totalCount: number;
  colors: ReturnType<typeof useTheme>['colors'];
}

function DesktopProgressBar({
  progressPercentage,
  submittedCount,
  pendingCount,
  notOptedCount,
  totalCount,
  colors,
}: DesktopProgressBarProps) {
  return (
    <View className="rounded-[14px] border border-border p-[18px] mb-6 flex-row items-center gap-6 bg-surface">
      <View>
        <Text className="text-[28px] leading-8 text-cobalt-500 font-sans-bold">
          {progressPercentage}
          <Text className="text-base font-sans" style={{ color: colors.textSecondary }}>
            %
          </Text>
        </Text>
        <Text
          className="text-[11px] mt-0.5 font-sans"
          style={{ color: colors.textSecondary }}
        >
          completed
        </Text>
      </View>
      <View className="flex-1">
        <View className="h-1.5 rounded-[3px] overflow-hidden mb-2.5 bg-border">
          <View
            className="h-full rounded-[3px] bg-cobalt-500"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
            }}
          />
        </View>
        <View className="flex-row gap-4">
          <Text className="text-[11px] font-sans" style={{ color: colors.success }}>
            {submittedCount} done
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.warning }}>
            {pendingCount} pending
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.textSecondary }}>
            {notOptedCount} skipped
          </Text>
          <Text className="text-[11px] font-sans" style={{ color: colors.textSecondary }}>
            {totalCount} total
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function FacultyListScreen() {
  const { showAlert } = useAlertStore();
  const { setSelectedFaculty } = useFeedbackStore();
  const { bottomOffset } = useSafeAreaStore();
  const { colors, isDark } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  const {
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

  const { totalCount, submittedCount, notOptedCount, pendingCount, progressPercentage } =
    getProgressStats();

  const handleRateFaculty = (faculty: FacultyFeedbackItem) => {
    if (isFeedbackLocked) return;
    setSelectedFaculty(faculty);
    const facultyId = createFacultyId(faculty.fac_code, faculty.sub_code, faculty.sec_id);
    router.push(`/feedback/faculty/${facultyId}` as any);
  };

  const handleSubmitAllFeedback = async () => {
    const result = await submitAllFeedback();
    if (result.success) {
      showAlert({ title: 'Success', message: 'All feedback submitted successfully!' });
      setShowConfirmLock(false);
    } else {
      showAlert({
        title: 'Error',
        message: result.error || 'Failed to finalize feedback',
      });
    }
  };

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1000}>
            <Header title="Faculty Feedback" showBackButton fallbackRoute="/(tabs)" />

            {isFeedbackLocked ? (
              <View className="items-center justify-center py-20 gap-3">
                <View className="w-16 h-16 rounded-full items-center justify-center bg-ink-100 dark:bg-ink-800">
                  <Lock size={30} color={colors.textTertiary ?? colors.textSecondary} />
                </View>
                <Text
                  className="text-[18px] font-sans-semi"
                  style={{ color: colors.text }}
                >
                  Feedback Locked
                </Text>
                <Text
                  className="text-[13px] text-center max-w-80 font-sans"
                  style={{
                    color: colors.textSecondary,
                  }}
                >
                  Your feedback has been submitted and is now locked.
                </Text>
              </View>
            ) : loading ? (
              <View className="items-center py-20 gap-3">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  className="text-[13px] font-sans"
                  style={{ color: colors.textSecondary }}
                >
                  Loading...
                </Text>
              </View>
            ) : error ? (
              <View className="items-center py-20 gap-4">
                <AlertCircle size={44} color={colors.danger} />
                <Text
                  className="text-[13px] text-center max-w-80 font-sans"
                  style={{
                    color: colors.danger,
                  }}
                >
                  {error}
                </Text>
                <Button title="Retry" onPress={refreshFeedback} fullWidth={false} />
              </View>
            ) : (
              <>
                {totalCount > 0 && (
                  <DesktopProgressBar
                    progressPercentage={progressPercentage}
                    submittedCount={submittedCount}
                    pendingCount={pendingCount}
                    notOptedCount={notOptedCount}
                    totalCount={totalCount}
                    colors={colors}
                  />
                )}

                {facultyList.length === 0 ? (
                  <View className="items-center py-20 gap-3">
                    <Clipboard size={44} color={colors.textSecondary} />
                    <Text
                      className="text-[13px] font-sans"
                      style={{ color: colors.textSecondary }}
                    >
                      No feedback available.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      className="text-[10px] uppercase mb-2 px-0.5 font-sans-semi"
                      style={{
                        color: colors.textTertiary ?? colors.textSecondary,
                        letterSpacing: 0.9,
                      }}
                    >
                      Faculty
                    </Text>
                    <View className="rounded-[14px] border border-border overflow-hidden mb-6 bg-surface">
                      {facultyList.map((faculty, i) => (
                        <DesktopFacultyRow
                          key={`${faculty.fac_code}-${faculty.sub_id}-${faculty.sec_id}`}
                          faculty={faculty}
                          onPress={() => handleRateFaculty(faculty)}
                          colors={colors}
                          isDark={isDark}
                          isLast={i === facultyList.length - 1}
                        />
                      ))}
                    </View>
                  </>
                )}

                {totalCount > 0 && (
                  <View className="rounded-[14px] border border-border p-4 bg-surface">
                    {showConfirmLock ? (
                      <View className="gap-2.5">
                        <Text
                          className="text-[14px] text-center font-sans-md"
                          style={{
                            color: colors.text,
                          }}
                        >
                          Finalize & Submit All Feedback?
                        </Text>
                        <View className="flex-row gap-2.5 justify-end">
                          <View className="min-w-[120px]">
                            <Button
                              title="Cancel"
                              variant="secondary"
                              onPress={() => setShowConfirmLock(false)}
                              disabled={submittingFinal}
                            />
                          </View>
                          <View className="min-w-[140px]">
                            <Button
                              title="Confirm Submit"
                              onPress={handleSubmitAllFeedback}
                              loading={submittingFinal}
                            />
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row items-center justify-between gap-3">
                        <Text
                          className="text-xs flex-1 font-sans"
                          style={{
                            color: colors.textSecondary,
                          }}
                        >
                          Once submitted, feedback cannot be edited.
                        </Text>
                        <View className="min-w-[160px]">
                          <Button
                            title={
                              progressPercentage < 100
                                ? 'Complete All to Submit'
                                : 'Final Submit'
                            }
                            onPress={() => setShowConfirmLock(true)}
                            disabled={progressPercentage < 100}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Faculty Feedback" showBackButton />

      {isFeedbackLocked ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-ink-100 dark:bg-ink-800 items-center justify-center mb-4">
            <Lock size={36} color={colors.textTertiary} />
          </View>
          <Text className="text-xl text-ink-900 mb-2 dark:text-ink-100 font-display">
            Feedback Locked
          </Text>
          <Text className="text-sm text-ink-500 text-center leading-relaxed font-sans">
            Your feedback has been submitted successfully.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: bottomOffset + 120 }}
          showsVerticalScrollIndicator={true}
        >
          {loading ? (
            <View className="items-center py-16 gap-3">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-ink-500 font-sans">Loading...</Text>
            </View>
          ) : error ? (
            <View className="items-center py-16 gap-4">
              <AlertCircle size={48} color={colors.danger} />
              <Text className="text-sm text-danger text-center font-sans">{error}</Text>
              <Button title="Retry" onPress={refreshFeedback} fullWidth={false} />
            </View>
          ) : (
            <>
              {totalCount > 0 && (
                <ProgressCard
                  submittedCount={submittedCount}
                  pendingCount={pendingCount}
                  notOptedCount={notOptedCount}
                  progressPercentage={progressPercentage}
                />
              )}

              {facultyList.length === 0 ? (
                <View className="items-center py-16 gap-4">
                  <Clipboard size={48} color={colors.textSecondary} />
                  <Text className="text-sm text-ink-500 font-sans">
                    No feedback available
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {facultyList.map((faculty) => (
                    <FacultyListItem
                      key={`${faculty.fac_code}-${faculty.sub_id}-${faculty.sec_id}`}
                      faculty={faculty}
                      onPress={() => handleRateFaculty(faculty)}
                    />
                  ))}
                </View>
              )}

              {totalCount > 0 && (
                <View className="mt-6 gap-3">
                  {showConfirmLock ? (
                    <View className="bg-ink-100 dark:bg-ink-800 rounded-2xl p-4 gap-4">
                      <Text className="text-center text-ink-900 dark:text-ink-100 font-sans-semi">
                        Finalize & Submit All Feedback?
                      </Text>
                      <View className="flex-row gap-3">
                        <View className="flex-1">
                          <Button
                            title="Cancel"
                            variant="secondary"
                            onPress={() => setShowConfirmLock(false)}
                            disabled={submittingFinal}
                          />
                        </View>
                        <View className="flex-1">
                          <Button
                            title="Confirm"
                            onPress={handleSubmitAllFeedback}
                            loading={submittingFinal}
                          />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Button
                      title={
                        progressPercentage < 100
                          ? 'Complete All to Submit'
                          : 'Final Submit'
                      }
                      onPress={() => setShowConfirmLock(true)}
                      disabled={progressPercentage < 100}
                    />
                  )}

                  <Text className="text-center text-[10px] text-ink-400 font-sans">
                    Once submitted, feedback cannot be edited.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
