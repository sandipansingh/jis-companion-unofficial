import { create } from "zustand";
import { FeeLedgerEntry } from "../api/fees";
import { syncFeeData } from "../services/sync";
import { useAuthStore } from "./authStore";

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
    const { feeData, loading } = get();
    if (feeData.length > 0 || loading) {
      console.log("Fee data already loaded or loading in progress");
      return;
    }

    set({ loading: true, error: null });

    try {
      const { studentId, loginData } = useAuthStore.getState();

      if (!studentId || !loginData) {
        throw new Error("User not authenticated");
      }

      const result = await syncFeeData(studentId, loginData.branch_id);

      console.log(
        `Fetched ${result.feeData.length} fee records (fromCache: ${result.fromCache})`
      );

      set({
        feeData: result.feeData,
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch fee data:", error);
      set({
        error: error.message || "Failed to fetch fee data",
        loading: false,
      });
    }
  },

  clearFeeData: async () => {
    try {
      const { studentId } = useAuthStore.getState();
      if (studentId) {
        const { deleteFeeData } = await import("../services/database");
        await deleteFeeData(studentId);
      }
      set({
        feeData: [],
        loading: false,
        error: null,
        fromCache: false,
      });
    } catch (error) {
      console.error("Error clearing fee data:", error);
      set({
        feeData: [],
        loading: false,
        error: null,
        fromCache: false,
      });
    }
  },
}));
