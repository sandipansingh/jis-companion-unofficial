import { create } from 'zustand';

import { fetchPyqs } from '../api/pyq';
import { Pyq, PyqSearchFilter } from '../types';

export interface PyqFilterParams {
  subjectName?: string;
  subjectCode?: string;
  year?: number;
  semester?: number;
  stream?: string;
}

interface PyqState {
  pyqs: Pyq[];
  page: number;
  totalPages: number;
  initialLoading: boolean;
  loadingMore: boolean;
  searchQuery: string;
  searchFilter: PyqSearchFilter;
  collegeCode: string;
  error: string | null;
  selectedPyq: Pyq | null;
  isFetching: boolean;

  setSearchQuery: (query: string) => void;
  setSearchFilter: (filter: PyqSearchFilter) => void;
  setSelectedPyq: (pyq: Pyq | null) => void;
  fetchInitial: (collegeCode: string, filters?: PyqFilterParams) => Promise<void>;
  fetchMore: (filters?: PyqFilterParams) => Promise<void>;
  reset: () => void;
}

const LIMIT = 51;

export const usePyqStore = create<PyqState>((set, get) => ({
  pyqs: [],
  page: 1,
  totalPages: 1,
  initialLoading: false,
  loadingMore: false,
  searchQuery: '',
  searchFilter: 'subjectName',
  collegeCode: '',
  error: null,
  selectedPyq: null,
  isFetching: false,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSearchFilter: (filter: PyqSearchFilter) => {
    set({ searchFilter: filter, searchQuery: '' });
  },

  setSelectedPyq: (pyq: Pyq | null) => {
    set({ selectedPyq: pyq });
  },

  fetchInitial: async (collegeCode: string, filters?: PyqFilterParams) => {
    if (get().isFetching) return;

    set({
      isFetching: true,
      initialLoading: true,
      pyqs: [],
      page: 1,
      totalPages: 1,
      error: null,
      collegeCode,
    });

    try {
      const result = await fetchPyqs({
        collegeCode,
        page: 1,
        limit: LIMIT,
        ...filters,
      });

      set({
        pyqs: result.data,
        page: 1,
        totalPages: result.totalPages,
        initialLoading: false,
        isFetching: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch question papers',
        initialLoading: false,
        isFetching: false,
      });
    }
  },

  fetchMore: async (filters?: PyqFilterParams) => {
    const { page, totalPages, collegeCode, loadingMore, isFetching } = get();

    if (isFetching || loadingMore || page >= totalPages) return;

    const nextPage = page + 1;

    set({ loadingMore: true, isFetching: true });

    try {
      const result = await fetchPyqs({
        collegeCode,
        page: nextPage,
        limit: LIMIT,
        ...filters,
      });

      set((state) => ({
        pyqs: [...state.pyqs, ...result.data],
        page: nextPage,
        totalPages: result.totalPages,
        loadingMore: false,
        isFetching: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load more';
      set({ loadingMore: false, isFetching: false, error: message });
    }
  },

  reset: () => {
    set({
      pyqs: [],
      page: 1,
      totalPages: 1,
      initialLoading: false,
      loadingMore: false,
      searchQuery: '',
      searchFilter: 'subjectName',
      collegeCode: '',
      error: null,
      selectedPyq: null,
      isFetching: false,
    });
  },
}));
