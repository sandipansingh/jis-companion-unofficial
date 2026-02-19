import { Button, Header } from "@/src/components";
import { useAlertStore } from "@/src/store/alertStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { router } from "expo-router";
import { AlertCircle, Clipboard, Lock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { FacultyFeedbackItem } from "../api";
import { FacultyListItem, ProgressCard } from "../components";
import { useFeedbackData } from "../hooks";
import { useFeedbackStore } from "../store";
import { createFacultyId } from "../utils/facultyId";

export default function FacultyListScreen() {
  const { showAlert } = useAlertStore();
  const { setSelectedFaculty } = useFeedbackStore();
  const { bottomOffset } = useSafeAreaStore();

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

  const {
    totalCount,
    submittedCount,
    notOptedCount,
    pendingCount,
    progressPercentage,
  } = getProgressStats();

  const handleRateFaculty = (faculty: FacultyFeedbackItem) => {
    if (isFeedbackLocked) return;
    setSelectedFaculty(faculty);
    const facultyId = createFacultyId(faculty.fac_code, faculty.sub_code, faculty.sec_id);
    router.push(`/feedback/faculty/${facultyId}` as any);
  };

  const handleSubmitAllFeedback = async () => {
    const result = await submitAllFeedback();
    if (result.success) {
      showAlert({ title: "Success", message: "All feedback submitted successfully!" });
      setShowConfirmLock(false);
    } else {
      showAlert({ title: "Error", message: result.error || "Failed to finalize feedback" });
    }
  };

  return (
    <View className="flex-1 bg-base">
      <Header title="Faculty Feedback" showBackButton />

      {/* Locked state */}
      {isFeedbackLocked ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-ink-100 dark:bg-ink-800 items-center justify-center mb-4">
            <Lock size={36} color="#94A3B8" />
          </View>
          <Text
            className="text-xl text-ink-900 mb-2 dark:text-ink-100"
            style={{ fontFamily: "ClashDisplay-Semibold" }}
          >
            Feedback Locked
          </Text>
          <Text
            className="text-sm text-ink-500 text-center leading-relaxed"
            style={{ fontFamily: "GeneralSans-Regular" }}
          >
            Your feedback has been submitted successfully.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: bottomOffset + 120 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className="items-center py-16 gap-3">
              <ActivityIndicator size="large" color="#2B5BDB" />
              <Text
                className="text-sm text-ink-500"
                style={{ fontFamily: "GeneralSans-Regular" }}
              >
                Loading...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center py-16 gap-4">
              <AlertCircle size={48} color="#DC2626" />
              <Text
                className="text-sm text-danger text-center"
                style={{ fontFamily: "GeneralSans-Regular" }}
              >
                {error}
              </Text>
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
                  <Clipboard size={48} color="#CBD5E1" />
                  <Text
                    className="text-sm text-ink-500"
                    style={{ fontFamily: "GeneralSans-Regular" }}
                  >
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
                    <View className="bg-ink-100 rounded-2xl p-4 gap-4">
                      <Text
                        className="text-center text-ink-900"
                        style={{ fontFamily: "GeneralSans-Semibold" }}
                      >
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
                      title={progressPercentage < 100 ? "Complete All to Submit" : "Final Submit"}
                      onPress={() => setShowConfirmLock(true)}
                      disabled={progressPercentage < 100}
                    />
                  )}

                  <Text
                    className="text-center text-[10px] text-ink-400"
                    style={{ fontFamily: "GeneralSans-Regular" }}
                  >
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
