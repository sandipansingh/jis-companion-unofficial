import apiClient, { StandardApiResponse } from "@/src/api/client";
import { handleApiError, parseApiResponse } from "@/src/utils/apiHelpers";
import { VirtualLabCourse, VirtualLabExperiment } from "../types";

/**
 * Fetch available virtual lab courses/streams.
 * @returns {Promise<VirtualLabCourse[]>} List of courses (empty when API returns an empty payload).
 * @throws {Error} When the API returns a non-zero error code or the request fails.
 */
export const fetchVirtualLabCourses = async (): Promise<VirtualLabCourse[]> => {
  try {
    const response = await apiClient.post<StandardApiResponse>("", {
      parameters: ["@p_course"],
      values: ["%"],
      function: "Proc_Get_Virtual_Lab_Course_Stream",
      branch_id: "0",
    });

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to fetch courses");
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    return parseApiResponse<VirtualLabCourse[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch virtual lab courses");
  }
};

/**
 * Fetch experiment list for a course/stream/semester.
 * @param {string} course - Course identifier used by the backend procedure.
 * @param {string} stream - Stream identifier used by the backend procedure.
 * @param {string} semester - Semester number as a string.
 * @returns {Promise<VirtualLabExperiment[]>} List of experiments.
 * @throws {Error} When the API returns a non-zero error code or the request fails.
 */
export const fetchVirtualLabExperiments = async (
  course: string,
  stream: string,
  semester: string
): Promise<VirtualLabExperiment[]> => {
  try {
    const response = await apiClient.post<StandardApiResponse>("", {
      parameters: ["@p_course", "@p_stream", "@p_sem"],
      values: [course, stream, semester],
      function: "Proc_Get_Virtual_Lab_Subject_Wise_Experiment",
      branch_id: "0",
    });

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to fetch experiments");
    }

    const dataString = response.data.data.data;
    return parseApiResponse<VirtualLabExperiment[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch virtual lab experiments");
  }
};
