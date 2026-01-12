import { useEffect, useState } from "react";
import { useFeedbackStore } from "../store";

export function useFeedbackData() {
  const {
    lockStatus,
    facultyList,
    loading,
    error,
    checkLockStatus,
    fetchFacultyList,
    finalSubmit,
  } = useFeedbackStore();

  const [initializing, setInitializing] = useState(true);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  useEffect(() => {
    initializeFeedback();
  }, []);

  const initializeFeedback = async () => {
    try {
      setInitializing(true);
      const isUnlocked = await checkLockStatus();
      if (isUnlocked) {
        await fetchFacultyList();
      }
    } catch (error) {
      console.error("Failed to initialize feedback:", error);
    } finally {
      setInitializing(false);
    }
  };

  const refreshFeedback = async () => {
    await initializeFeedback();
  };

  const getProgressStats = () => {
    const totalCount = facultyList.length;

    const submittedCount = facultyList.filter(
      (f) => f.totalRating === 100
    ).length;
    const notOptedCount = facultyList.filter(
      (f) => f.totalRating === -10
    ).length;
    const pendingCount = facultyList.filter((f) => f.totalRating === 0).length;

    const completedCount = submittedCount + notOptedCount;
    const progressPercentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      submittedCount,
      notOptedCount,
      pendingCount,
      completedCount,
      progressPercentage,
    };
  };

  const isFeedbackLocked = lockStatus?.locStatus === 1;

  const canSubmitFinal = () => {
    const { pendingCount } = getProgressStats();
    return !isFeedbackLocked && pendingCount === 0;
  };

  const getFacultyByStatus = (status: "pending" | "submitted" | "notOpted") => {
    switch (status) {
      case "pending":
        return facultyList.filter((f) => f.totalRating === 0);
      case "submitted":
        return facultyList.filter((f) => f.totalRating === 100);
      case "notOpted":
        return facultyList.filter((f) => f.totalRating === -10);
      default:
        return [];
    }
  };

  const handleFinalSubmit = async () => {
    setSubmittingFinal(true);
    try {
      await finalSubmit();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to finalize feedback",
      };
    } finally {
      setSubmittingFinal(false);
    }
  };

  return {
    lockStatus,
    facultyList,
    loading: loading || initializing,
    error,
    isFeedbackLocked,
    submittingFinal,
    initializeFeedback,
    refreshFeedback,
    finalSubmit,
    handleFinalSubmit,
    getProgressStats,
    canSubmitFinal,
    getFacultyByStatus,
  };
}
