import { create } from 'zustand';

import { useAuthStore } from '@/src/features/auth/store/authStore';
import { syncFeeData } from '@/src/services/sync';

import { FeeLedgerEntry } from '../types';

interface FeesStore {
  feeData: FeeLedgerEntry[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  fromCache: boolean;
  fetchFeeData: () => Promise<void>;
  clearFeeData: () => void;
}

export const useFeesStore = create<FeesStore>((set, get) => ({
  feeData: [],
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,

  fetchFeeData: async () => {
    const { loading } = get();
    if (loading) return;

    const { studentId, loginData } = useAuthStore.getState();
    if (!studentId || !loginData) {
      set({ error: 'User not authenticated', loading: false });
      return;
    }

    try {
      const { getFeeData } = await import('@/src/services/database');
      const cached = await getFeeData(studentId);
      if (cached) {
        set({ feeData: cached, fromCache: true, error: null });
      } else {
        set({ loading: true, error: null });
      }
    } catch {
      set({ loading: true, error: null });
    }

    try {
      const result = await syncFeeData(studentId, loginData.branch_id);

      console.log(
        `Fetched ${result.feeData.length} fee records (fromCache: ${result.fromCache})`,
      );

      set({
        feeData: result.feeData,
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch fee data:', error);
      const { feeData } = get();
      if (feeData.length > 0) {
        set({ loading: false, isOnline: false, fromCache: true });
      } else {
        set({
          error: error.message || 'Failed to fetch fee data',
          loading: false,
        });
      }
    }
  },

  clearFeeData: () => {
    set({
      feeData: [],
      loading: false,
      error: null,
      fromCache: false,
    });
  },
}));
