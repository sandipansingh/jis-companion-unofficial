import apiClient, { StandardApiResponse } from "@/src/api/client";
import { handleApiError, parseApiResponse } from "@/src/utils/apiHelpers";
import { DEMO_FACULTY_LIST, getDemoFeedbackQuestions } from "@/src/utils/demo";
import {
  FacultyFeedbackItem,
  FeedbackLockStatus,
  FeedbackQuestion,
  FeedbackSaveResponse,
} from "../types";

/**
 * Check if feedback is locked or unlocked for the student
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 */
export async function getFeedbackLockStatus(
  collegeId: number,
  stdtId: number,
  branchId: number,
): Promise<FeedbackLockStatus> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return { locStatus: 0 }; // Unlocked for demo
    }

    const body = {
      parameters: ["@p_college_id", "@p_student_id"],
      values: [collegeId.toString(), stdtId.toString()],
      function: "Proc_App_Get_Fac_Feedback_Status",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to load feedback status",
      );
    }

    return parseApiResponse<FeedbackLockStatus>(response.data.data.data, {
      locStatus: 1,
    });
  } catch (error) {
    handleApiError(error, "Get feedback lock status");
  }
}

/**
 * Get list of faculties with subjects for feedback
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 */
export async function getFacultyList(
  collegeId: number,
  stdtId: number,
  branchId: number,
): Promise<FacultyFeedbackItem[]> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return DEMO_FACULTY_LIST;
    }

    const body = {
      parameters: ["@p_college_id", "@p_student_id"],
      values: [collegeId.toString(), stdtId.toString()],
      function: "Proc_App_Get_Data_For_Fac_Feedback",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to load faculty list");
    }

    const parsed = parseApiResponse<FacultyFeedbackItem[]>(
      response.data.data.data,
      [],
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    handleApiError(error, "Get faculty list");
  }
}

/**
 * Get feedback questions for a specific faculty
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 * @param facultyItem - Faculty item details
 */
export async function getFeedbackQuestions(
  collegeId: number,
  stdtId: number,
  branchId: number,
  facultyItem: FacultyFeedbackItem,
): Promise<FeedbackQuestion[]> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return getDemoFeedbackQuestions();
    }

    const body = {
      parameters: [
        "@p_college_id",
        "@p_student_id",
        "@p_session_id",
        "@p_batch_id",
        "@p_sem_id",
        "@p_course_id",
        "@p_stream_id",
        "@p_sub_id",
        "@p_sec_id",
        "@p_fac_code",
        "@p_name",
      ],
      values: [
        collegeId.toString(),
        stdtId.toString(),
        facultyItem.session_id.toString(),
        facultyItem.batch_id.toString(),
        facultyItem.sem_id.toString(),
        facultyItem.course_id.toString(),
        facultyItem.stream_id.toString(),
        facultyItem.sub_id.toString(),
        facultyItem.sec_id.toString(),
        facultyItem.fac_code,
        "%",
      ],
      function: "Proc_App_Get_Feedback",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to load feedback questions",
      );
    }

    return parseApiResponse<FeedbackQuestion[]>(response.data.data.data, []);
  } catch (error) {
    handleApiError(error, "Get feedback questions");
  }
}

/**
 * Save feedback for a specific faculty
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 * @param facultyItem - Faculty item details
 * @param questions - Feedback questions with ratings
 */
export async function saveFeedback(
  collegeId: number,
  stdtId: number,
  branchId: number,
  facultyItem: FacultyFeedbackItem,
  questions: FeedbackQuestion[],
): Promise<FeedbackSaveResponse> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return {
        err_mesg: "Feedback saved successfully (Demo Mode)",
        err_no: 0,
        doc_no: "DEMO-FB-001",
        doc_id: 1,
      };
    }

    const body = {
      parameters: [
        "@p_college_id",
        "@p_student_id",
        "@p_session_id",
        "@p_batch_id",
        "@p_sem_id",
        "@p_course_id",
        "@p_stream_id",
        "@p_sub_id",
        "@p_sec_id",
        "@p_fac_code",
        "@p_json",
      ],
      values: [
        collegeId.toString(),
        stdtId.toString(),
        facultyItem.session_id.toString(),
        facultyItem.batch_id.toString(),
        facultyItem.sem_id.toString(),
        facultyItem.course_id.toString(),
        facultyItem.stream_id.toString(),
        facultyItem.sub_id.toString(),
        facultyItem.sec_id.toString(),
        facultyItem.fac_code,
        JSON.stringify(questions),
      ],
      function: "Proc_App_Save_Student_Feedback",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to save feedback");
    }

    const parsed = parseApiResponse<FeedbackSaveResponse[]>(
      response.data.data.data,
      [],
    );
    return parsed[0];
  } catch (error) {
    handleApiError(error, "Save feedback");
  }
}

/**
 * Mark faculty as "not opted" by student
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 * @param facultyItem - Faculty item details
 */
export async function markFacultyNotOpted(
  collegeId: number,
  stdtId: number,
  branchId: number,
  facultyItem: FacultyFeedbackItem,
): Promise<FeedbackSaveResponse> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return {
        err_mesg: "Faculty marked as not opted (Demo Mode)",
        err_no: 0,
        doc_no: "DEMO-FB-NO-001",
        doc_id: 1,
      };
    }

    const body = {
      parameters: [
        "@p_college_id",
        "@p_student_id",
        "@p_session_id",
        "@p_batch_id",
        "@p_sem_id",
        "@p_course_id",
        "@p_stream_id",
        "@p_sub_id",
        "@p_sec_id",
        "@p_fac_code",
      ],
      values: [
        collegeId.toString(),
        stdtId.toString(),
        facultyItem.session_id.toString(),
        facultyItem.batch_id.toString(),
        facultyItem.sem_id.toString(),
        facultyItem.course_id.toString(),
        facultyItem.stream_id.toString(),
        facultyItem.sub_id.toString(),
        facultyItem.sec_id.toString(),
        facultyItem.fac_code,
      ],
      function: "Proc_App_Save_Student_Feedback_For_NotOpted",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to skip faculty feedback",
      );
    }

    const parsed = parseApiResponse<FeedbackSaveResponse[]>(
      response.data.data.data,
      [],
    );
    return parsed[0];
  } catch (error) {
    handleApiError(error, "Mark faculty not opted");
  }
}

/**
 * Final save after all feedback is submitted
 * @param collegeId - College ID
 * @param stdtId - Student ID
 * @param branchId - Branch ID
 * @param sessionId - Session ID
 * @param batchId - Batch ID
 * @param semId - Semester ID
 * @param courseId - Course ID
 * @param streamId - Stream ID
 * @param secId - Section ID
 */
export async function finalSaveFeedback(
  collegeId: number,
  stdtId: number,
  branchId: number,
  sessionId: number,
  batchId: number,
  semId: number,
  courseId: number,
  streamId: number,
  secId: number,
): Promise<FeedbackSaveResponse> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return {
        err_mesg:
          "All feedback submitted successfully (Demo Mode - No data saved)",
        err_no: 0,
        doc_no: "DEMO-FB-FINAL-001",
        doc_id: 1,
      };
    }

    const body = {
      parameters: [
        "@p_college_id",
        "@p_student_id",
        "@p_session_id",
        "@p_batch_id",
        "@p_sem_id",
        "@p_course_id",
        "@p_stream_id",
        "@p_sec_id",
      ],
      values: [
        collegeId.toString(),
        stdtId.toString(),
        sessionId.toString(),
        batchId.toString(),
        semId.toString(),
        courseId.toString(),
        streamId.toString(),
        secId.toString(),
      ],
      function: "Proc_App_Save_Student_Feedback_Final",
      branch_id: branchId.toString(),
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to submit all feedback");
    }

    const parsed = parseApiResponse<FeedbackSaveResponse[]>(
      response.data.data.data,
      [],
    );
    return parsed[0];
  } catch (error) {
    handleApiError(error, "Final save feedback");
  }
}
