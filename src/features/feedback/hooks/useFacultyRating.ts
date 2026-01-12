import { useEffect, useState } from "react";
import { FacultyFeedbackItem, FeedbackQuestion } from "../api";
import { useFeedbackStore } from "../store";

interface UseFacultyRatingParams {
  facCode: string | null;
  subCode: string | null;
  secId: number | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useFacultyRating({
  facCode,
  subCode,
  secId,
  onSuccess,
  onError,
}: UseFacultyRatingParams) {
  const {
    getFacultyById,
    getFeedbackForFaculty,
    submitFeedback,
    markNotOpted,
  } = useFeedbackStore();

  const [faculty, setFaculty] = useState<FacultyFeedbackItem | null>(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState<
    FeedbackQuestion[]
  >([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [skippingFeedback, setSkippingFeedback] = useState(false);

  useEffect(() => {
    if (facCode && subCode && secId !== null) {
      setLoadingFaculty(true);
      const facultyData = getFacultyById(facCode, subCode, secId);
      if (facultyData) {
        setFaculty(facultyData);
        loadFeedbackQuestions(facultyData);
      } else {
        onError?.("Failed to load faculty information");
      }
      setLoadingFaculty(false);
    }
  }, [facCode, subCode, secId]);

  useEffect(() => {
    if (feedbackQuestions.length > 0) {
      const initialRatings: { [key: number]: number } = {};
      feedbackQuestions.forEach((q) => {
        initialRatings[q.id] = q.rating || 10;
      });
      setRatings(initialRatings);
    }
  }, [feedbackQuestions]);

  const loadFeedbackQuestions = async (facultyData: FacultyFeedbackItem) => {
    setLoadingQuestions(true);
    try {
      const questions = await getFeedbackForFaculty(facultyData);
      setFeedbackQuestions(questions);
    } catch (error: any) {
      onError?.(error.message || "Failed to load feedback questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const validateRatings = (): boolean => {
    return feedbackQuestions.every(
      (q) => ratings[q.id] >= 1 && ratings[q.id] <= 10
    );
  };

  const handleSubmitFeedback = async () => {
    if (!faculty) return { success: false, error: "Faculty data not loaded" };

    if (!validateRatings()) {
      return {
        success: false,
        error: "Please rate all criteria before submitting.",
      };
    }

    setSubmittingFeedback(true);
    try {
      const updatedQuestions = feedbackQuestions.map((q) => ({
        ...q,
        rating: ratings[q.id],
      }));

      await submitFeedback(faculty, updatedQuestions);
      onSuccess?.();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to submit feedback";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSkipFeedback = async () => {
    if (!faculty) return { success: false, error: "Faculty data not loaded" };

    setSkippingFeedback(true);
    try {
      await markNotOpted(faculty);
      onSuccess?.();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to skip feedback!";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSkippingFeedback(false);
    }
  };

  const updateRating = (questionId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  return {
    faculty,
    feedbackQuestions,
    ratings,
    loadingFaculty,
    loadingQuestions,
    submittingFeedback,
    skippingFeedback,
    isReady: !!faculty && !loadingQuestions,
    isLoading: submittingFeedback || skippingFeedback,
    handleSubmitFeedback,
    handleSkipFeedback,
    updateRating,
    validateRatings,
  };
}
