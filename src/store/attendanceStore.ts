import { create } from "zustand";
import { DateWiseAttendance, SubjectWiseAttendance } from "../api/academics";
import { syncAttendanceData } from "../services/sync";
import { getMonthKey as getMonthKeyHelper } from "../utils/dateHelpers";
import { useAuthStore } from "./authStore";

interface MonthAttendanceData {
  subjectWiseAttendance: SubjectWiseAttendance[];
  dateWiseAttendance: DateWiseAttendance[];
}

interface MonthlyAttendanceData {
  [key: string]: MonthAttendanceData; // key format: "month-year" (e.g., "12-2025")
}

interface AttendanceStore {
  monthlyData: MonthlyAttendanceData;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  fromCache: boolean;
  fetchMonthAttendance: (year: number, month: number) => Promise<void>;
  getMonthData: (year: number, month: number) => MonthAttendanceData | null;
  getSubjectWiseData: (
    year: number,
    month: number
  ) => SubjectWiseAttendance[] | null;
  getDateWiseData: (year: number, month: number) => DateWiseAttendance[] | null;
  clearAttendanceData: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  monthlyData: {},
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,

  fetchMonthAttendance: async (year: number, month: number) => {
    const monthKey = getMonthKeyHelper(year, month);

    if (get().monthlyData[monthKey]) {
      console.log(`Attendance data for ${monthKey} already in memory`);
      return;
    }

    set({ loading: true, error: null });

    try {
      const { studentId, loginData } = useAuthStore.getState();

      if (!studentId || !loginData) {
        throw new Error("User not authenticated");
      }

      const result = await syncAttendanceData(
        studentId,
        loginData.college_id,
        loginData.branch_id,
        year,
        month,
        monthKey
      );

      set((state) => ({
        monthlyData: {
          ...state.monthlyData,
          [monthKey]: {
            subjectWiseAttendance: result.subjectWiseData,
            dateWiseAttendance: result.dateWiseData,
          },
        },
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
      }));
    } catch (error: any) {
      console.error(`Failed to fetch attendance for ${monthKey}:`, error);
      set({
        error: error.message || "Failed to fetch attendance data",
        loading: false,
      });
    }
  },

  getMonthData: (year: number, month: number) => {
    const monthKey = getMonthKeyHelper(year, month);
    return get().monthlyData[monthKey] || null;
  },

  getSubjectWiseData: (year: number, month: number) => {
    const monthKey = getMonthKeyHelper(year, month);
    return get().monthlyData[monthKey]?.subjectWiseAttendance || null;
  },

  getDateWiseData: (year: number, month: number) => {
    const monthKey = getMonthKeyHelper(year, month);
    return get().monthlyData[monthKey]?.dateWiseAttendance || null;
  },

  clearAttendanceData: async () => {
    try {
      const { studentId } = useAuthStore.getState();
      if (studentId) {
        const { deleteAttendanceData } = await import("../services/database");
        await deleteAttendanceData(studentId);
      }
      set({ monthlyData: {}, loading: false, error: null });
    } catch (error) {
      console.error("Error clearing attendance data:", error);
      set({ monthlyData: {}, loading: false, error: null });
    }
  },
}));
