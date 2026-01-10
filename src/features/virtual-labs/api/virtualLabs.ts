import apiClient, { StandardApiResponse } from "@/src/api/client";

export interface VirtualLabCourse {
  course_name: string;
  stream_name: string;
  sem_no: string;
}

export interface VirtualLabExperiment {
  sl: number;
  subject_code?: string;
  experiment: string;
  link: string;
}

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

    const courses = JSON.parse(dataString) as VirtualLabCourse[];
    return courses;
  } catch (error: any) {
    console.error("Error fetching virtual lab courses:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch virtual lab courses"
    );
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
    const experiments = JSON.parse(dataString) as VirtualLabExperiment[];
    return experiments;
  } catch (error: any) {
    console.error("Error fetching virtual lab experiments:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch virtual lab experiments"
    );
  }
};
