import apiClient, { StandardApiResponse } from "@/src/api/client";
import { handleApiError, parseApiResponse } from "@/src/utils/apiHelpers";
import { getCurrentDateComponents } from "@/src/utils/dateHelpers";
import {
  DEMO_ATTENDANCE_DATA,
  getDemoDateAttendance,
  getDemoSubjectAttendance,
} from "@/src/utils/demo";

export interface AttendanceData {
  total_class: number;
  attd: number;
  pcent: number;
}

export interface DateWiseAttendance {
  rtDate: string;
  rtCount: number;
  rtPresent: number;
}

export interface SubjectWiseAttendance {
  date1: string;
  batch1: number;
  CourseId1: number;
  StreamId1: number;
  SectionId1: number;
  SemesterId1: number;
  SubjectId1: number;
  subject_name: string;
  emp_code: string;
  faculty: string;
  GroupId1: number;
  Period1: number;
  Period_name: string;
  ctr1: number;
  is_app: number;
  present1: number;
  absent1: number;
  concat_data: string;
  stat: string;
  upload1: string;
  upload2: string;
  upload3: string;
  upload4: string;
  upload5: string;
  assignment_id: number;
  assignment_status: number;
  assignment_marks: number;
  feedback: number;
}

/**
 * Fetch attendance percentage for the current month.
 *
 * @param {string} studentId - Student code.
 * @param {number} collegeId - College id used by the backend.
 * @param {number} branchId - Branch id used by the backend.
 * @returns {Promise<AttendanceData>} Attendance data for the current month.
 * @throws {Error} When the API returns a non-zero error code or a request fails.
 */
export async function fetchAttendancePercentage(
  studentId: string,
  collegeId: number,
  branchId: number,
): Promise<AttendanceData> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return DEMO_ATTENDANCE_DATA;
    }

    const collegeIdStr = collegeId?.toString() || "2";
    const branchIdStr = branchId?.toString() || "3";

    const { year, month } = getCurrentDateComponents();
    const yearStr = year.toString();
    const monthStr = month.toString();

    const body = {
      parameters: ["@p_COLLEGE_ID", "@P_STUDENT_CODE", "@P_YEAR", "@P_MONTH"],
      values: [collegeIdStr, studentId, yearStr, monthStr],
      function: "Proc_App_Get_Attendence_percentage_For_Student",
      branch_id: branchIdStr,
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to fetch attendance");
    }

    const parsedData = parseApiResponse<AttendanceData[]>(
      response.data.data.data,
      [],
    );

    if (!parsedData || parsedData.length === 0) {
      throw new Error("No attendance data found");
    }

    return parsedData[0];
  } catch (error) {
    handleApiError(error, "Fetch attendance percentage");
  }
}

/**
 * Fetch date-wise attendance for a given month and year.
 *
 * @param {string} studentId - Student code.
 * @param {number} branchId - Branch id used by the backend.
 * @param {string} [year] - Target year as a string (defaults to current year).
 * @param {string} [month] - Target month as a string (defaults to current month).
 * @returns {Promise<DateWiseAttendance[]>} List of date-wise attendance records.
 * @throws {Error} When the API returns a non-zero error code or a request fails.
 */
export async function fetchDateWiseAttendance(
  studentId: string,
  branchId: number,
  year?: string,
  month?: string,
): Promise<DateWiseAttendance[]> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return getDemoDateAttendance();
    }

    const branchIdStr = branchId?.toString() || "3";

    const current = getCurrentDateComponents();
    const targetYear = year || current.year.toString();
    const targetMonth = month || current.month.toString();

    const body = {
      parameters: ["@P_BRANCH_ID", "@P_STUDENT_CODE", "@P_YEAR", "@P_MONTH"],
      values: [branchIdStr, studentId, targetYear, targetMonth],
      function: "Proc_App_Get_Student_Date_Wise_Schedule_Vs_Attendance",
      branch_id: branchIdStr,
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to fetch date-wise attendance",
      );
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    return parseApiResponse<DateWiseAttendance[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch date-wise attendance");
  }
}

/**
 * Fetch subject-wise attendance for a given date range.
 *
 * @param {string} studentId - Student code.
 * @param {number} collegeId - College id used by the backend.
 * @param {number} branchId - Branch id used by the backend.
 * @param {string} fromDate - Start date in 'YYYY-MM-DD' format.
 * @param {string} toDate - End date in 'YYYY-MM-DD' format.
 * @returns {Promise<SubjectWiseAttendance[]>} List of subject-wise attendance records.
 * @throws {Error} When the API returns a non-zero error code or a request fails.
 */
export async function fetchSubjectWiseAttendance(
  studentId: string,
  collegeId: number,
  branchId: number,
  fromDate: string,
  toDate: string,
): Promise<SubjectWiseAttendance[]> {
  try {
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return getDemoSubjectAttendance();
    }

    const collegeIdStr = collegeId?.toString() || "2";
    const branchIdStr = branchId?.toString() || "3";

    const body = {
      parameters: [
        "@P_COLLEGE_ID",
        "@P_STUDENT_CODE",
        "@P_FROM_DATE",
        "@P_TO_DATE",
        "@p_is_json",
      ],
      values: [collegeIdStr, studentId, fromDate, toDate, "1"],
      function:
        "Proc_App_Get_Student_Date_Wise_Schedule_Vs_Attendance_With_Subject",
      branch_id: branchIdStr,
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to fetch subject-wise attendance",
      );
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    return parseApiResponse<SubjectWiseAttendance[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch subject-wise attendance");
  }
}
