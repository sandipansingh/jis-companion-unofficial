import { useAuthStore } from "@/src/features/auth";
import { create } from "zustand";
import {
    finalSaveFeedback,
    getFacultyList,
    getFeedbackLockStatus,
    getFeedbackQuestions,
    markFacultyNotOpted,
    saveFeedback,
} from "../api";
import {
    FacultyFeedbackItem,
    FeedbackLockStatus,
    FeedbackQuestion,
} from "../types";

interface FeedbackStore {
  lockStatus: FeedbackLockStatus | null;
  facultyList: FacultyFeedbackItem[];
  loading: boolean;
  error: string | null;
  selectedFaculty: FacultyFeedbackItem | null;

  checkLockStatus: () => Promise<boolean>;
  fetchFacultyList: () => Promise<void>;
  getFacultyById: (
    facCode: string,
    subCode: string,
    secId: number
  ) => FacultyFeedbackItem | null;
  setSelectedFaculty: (faculty: FacultyFeedbackItem | null) => void;
  getFeedbackForFaculty: (
    faculty: FacultyFeedbackItem
  ) => Promise<FeedbackQuestion[]>;
  submitFeedback: (
    faculty: FacultyFeedbackItem,
    questions: FeedbackQuestion[]
  ) => Promise<void>;
  markNotOpted: (faculty: FacultyFeedbackItem) => Promise<void>;
  finalSubmit: () => Promise<void>;
  clearFeedbackData: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  lockStatus: null,
  facultyList: [],
  selectedFaculty: null,
  loading: false,
  error: null,

  checkLockStatus: async () => {
    set({ loading: true, error: null });

    try {
      const { loginData } = useAuthStore.getState();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      const status = await getFeedbackLockStatus(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id
      );

      set({ lockStatus: status, loading: false });

      return status.locStatus === 0;
    } catch (error: any) {
      console.error("Failed to check lock status:", error);
      const userMessage = error.message?.includes("authenticated")
        ? "Please log in again"
        : error.message || "Failed to check feedback status. Please try again.";
      set({
        error: userMessage,
        loading: false,
      });
      return false;
    }
  },

  fetchFacultyList: async () => {
    const { facultyList, loading } = get();

    if (facultyList.length > 0 || loading) {
      console.log("Faculty list already loaded or loading in progress");
      return;
    }

    set({ loading: true, error: null });

    try {
      const { loginData } = useAuthStore.getState();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      const faculties = await getFacultyList(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id
      );

      console.log(`Fetched ${faculties.length} faculty records`);

      set({
        facultyList: faculties,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch faculty list:", error);
      const userMessage = error.message?.includes("authenticated")
        ? "Please log in again"
        : error.message || "Failed to load feedback data. Please try again.";
      set({
        error: userMessage,
        loading: false,
      });
    }
  },

  getFacultyById: (facCode: string, subCode: string, secId: number) => {
    const { facultyList, selectedFaculty } = get();

    if (
      selectedFaculty &&
      selectedFaculty.fac_code === facCode &&
      selectedFaculty.sub_code === subCode &&
      selectedFaculty.sec_id === secId
    ) {
      return selectedFaculty;
    }

    return (
      facultyList.find(
        (f) =>
          f.fac_code === facCode && f.sub_code === subCode && f.sec_id === secId
      ) || null
    );
  },

  setSelectedFaculty: (faculty: FacultyFeedbackItem | null) => {
    set({ selectedFaculty: faculty });
  },

  getFeedbackForFaculty: async (faculty: FacultyFeedbackItem) => {
    try {
      const { loginData } = useAuthStore.getState();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      const questions = await getFeedbackQuestions(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id,
        faculty
      );

      return questions;
    } catch (error: any) {
      console.error("Failed to fetch feedback questions:", error);
      throw error;
    }
  },

  submitFeedback: async (
    faculty: FacultyFeedbackItem,
    questions: FeedbackQuestion[]
  ) => {
    try {
      const { loginData } = useAuthStore.getState();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      const result = await saveFeedback(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id,
        faculty,
        questions
      );

      if (result.err_no !== 0) {
        throw new Error(result.err_mesg || "Failed to save feedback");
      }

      const { facultyList } = get();
      const updatedList = facultyList.map((f) => {
        if (
          f.fac_code === faculty.fac_code &&
          f.sub_id === faculty.sub_id &&
          f.sec_id === faculty.sec_id
        ) {
          return { ...f, totalRating: 100 };
        }
        return f;
      });

      set({ facultyList: updatedList });
    } catch (error: any) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  },

  markNotOpted: async (faculty: FacultyFeedbackItem) => {
    try {
      const { loginData } = useAuthStore.getState();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      const result = await markFacultyNotOpted(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id,
        faculty
      );

      if (result.err_no !== 0) {
        throw new Error(
          result.err_mesg || "Failed to mark faculty as not opted"
        );
      }

      const { facultyList } = get();
      const updatedList = facultyList.map((f) => {
        if (
          f.fac_code === faculty.fac_code &&
          f.sub_id === faculty.sub_id &&
          f.sec_id === faculty.sec_id
        ) {
          return { ...f, totalRating: -10 };
        }
        return f;
      });

      set({ facultyList: updatedList });
    } catch (error: any) {
      console.error("Failed to mark faculty as not opted:", error);
      throw error;
    }
  },

  finalSubmit: async () => {
    try {
      const { loginData } = useAuthStore.getState();
      const { facultyList } = get();

      if (!loginData) {
        throw new Error("User not authenticated");
      }

      if (facultyList.length === 0) {
        throw new Error("No faculty data available");
      }

      const firstFaculty = facultyList[0];

      const result = await finalSaveFeedback(
        loginData.college_id,
        loginData.std_id,
        loginData.branch_id,
        firstFaculty.session_id,
        firstFaculty.batch_id,
        firstFaculty.sem_id,
        firstFaculty.course_id,
        firstFaculty.stream_id,
        firstFaculty.sec_id
      );

      if (result.err_no !== 0) {
        throw new Error(result.err_mesg || "Failed to finalize feedback");
      }

      set({
        lockStatus: { locStatus: 1 },
        facultyList: [],
      });
    } catch (error: any) {
      console.error("Failed to finalize feedback:", error);
      throw error;
    }
  },

  clearFeedbackData: () => {
    set({
      lockStatus: null,
      facultyList: [],
      selectedFaculty: null,
      loading: false,
      error: null,
    });
  },
}));
