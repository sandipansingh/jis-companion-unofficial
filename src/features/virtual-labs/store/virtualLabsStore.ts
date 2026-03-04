import { create } from 'zustand';

import { syncVirtualLabCourses, syncVirtualLabExperiments } from '@/src/services/sync';

import { VirtualLabCourse, VirtualLabExperiment } from '../types';

interface VirtualLabsState {
  courses: VirtualLabCourse[];
  experiments: VirtualLabExperiment[];
  selectedCourse: VirtualLabCourse | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  fromCache: boolean;
  selectionCourse: string;
  selectionStream: string;
  selectionSemester: string;

  fetchCourses: () => Promise<void>;
  fetchExperiments: (course: string, stream: string, semester: string) => Promise<void>;
  setSelectedCourse: (course: VirtualLabCourse | null) => void;
  setSelectionCourse: (course: string) => void;
  setSelectionStream: (stream: string) => void;
  setSelectionSemester: (semester: string) => void;
  clearError: () => void;
  clearVirtualLabsData: () => void;
}

export const useVirtualLabsStore = create<VirtualLabsState>((set) => ({
  courses: [],
  experiments: [],
  selectedCourse: null,
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,

  selectionCourse: '',
  selectionStream: '',
  selectionSemester: '',

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const result = await syncVirtualLabCourses();
      set({
        courses: result.courses,
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch courses',
        loading: false,
      });
    }
  },

  fetchExperiments: async (course: string, stream: string, semester: string) => {
    set({ loading: true, error: null });
    try {
      const result = await syncVirtualLabExperiments(course, stream, semester);
      set({
        experiments: result.experiments,
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch experiments',
        loading: false,
      });
    }
  },

  setSelectedCourse: (course: VirtualLabCourse | null) => {
    set({ selectedCourse: course, experiments: [] });
  },

  setSelectionCourse: (course: string) => {
    set({ selectionCourse: course, selectionStream: '', selectionSemester: '' });
  },

  setSelectionStream: (stream: string) => {
    set({ selectionStream: stream, selectionSemester: '' });
  },

  setSelectionSemester: (semester: string) => {
    set({ selectionSemester: semester });
  },

  clearError: () => {
    set({ error: null });
  },

  clearVirtualLabsData: () => {
    set({
      courses: [],
      experiments: [],
      selectedCourse: null,
      loading: false,
      error: null,
      fromCache: false,
      selectionCourse: '',
      selectionStream: '',
      selectionSemester: '',
    });
  },
}));
