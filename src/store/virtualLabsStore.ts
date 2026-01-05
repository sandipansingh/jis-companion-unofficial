import { create } from "zustand";
import {
  VirtualLabCourse,
  VirtualLabExperiment,
  fetchVirtualLabCourses,
  fetchVirtualLabExperiments,
} from "../api/virtualLabs";

interface VirtualLabsState {
  courses: VirtualLabCourse[];
  experiments: VirtualLabExperiment[];
  selectedCourse: VirtualLabCourse | null;
  loading: boolean;
  error: string | null;
  
  fetchCourses: () => Promise<void>;
  fetchExperiments: (
    course: string,
    stream: string,
    semester: string
  ) => Promise<void>;
  setSelectedCourse: (course: VirtualLabCourse | null) => void;
  clearError: () => void;
}

export const useVirtualLabsStore = create<VirtualLabsState>((set) => ({
  courses: [],
  experiments: [],
  selectedCourse: null,
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const courses = await fetchVirtualLabCourses();
      set({ courses, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch courses",
        loading: false,
      });
    }
  },

  fetchExperiments: async (
    course: string,
    stream: string,
    semester: string
  ) => {
    set({ loading: true, error: null });
    try {
      const experiments = await fetchVirtualLabExperiments(
        course,
        stream,
        semester
      );
      set({ experiments, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch experiments",
        loading: false,
      });
    }
  },

  setSelectedCourse: (course: VirtualLabCourse | null) => {
    set({ selectedCourse: course, experiments: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
