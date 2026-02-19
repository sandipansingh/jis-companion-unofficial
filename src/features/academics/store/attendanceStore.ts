import { useAuthStore } from "@/src/features/auth/store/authStore";
import { syncAttendanceData } from "@/src/services/sync";
import { getMonthKey as getMonthKeyHelper } from "@/src/utils/dateHelpers";
import { create } from "zustand";
import { DateWiseAttendance, SubjectWiseAttendance } from "../api/academics";

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
  selectedClass: SubjectWiseAttendance | null;
  fetchMonthAttendance: (year: number, month: number) => Promise<void>;
  getMonthData: (year: number, month: number) => MonthAttendanceData | null;
  getSubjectWiseData: (
    year: number,
    month: number
  ) => SubjectWiseAttendance[] | null;
  getDateWiseData: (year: number, month: number) => DateWiseAttendance[] | null;
  getClassByIdentifier: (
    date: string,
    empCode: string,
    periodName: string
  ) => SubjectWiseAttendance | null;
  setSelectedClass: (classData: SubjectWiseAttendance | null) => void;
  clearAttendanceData: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  monthlyData: {},
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,
  selectedClass: null,

  fetchMonthAttendance: async (year: number, month: number) => {
    const monthKey = getMonthKeyHelper(year, month);

    if (get().monthlyData[monthKey]) {
      console.log(`Attendance data for ${monthKey} already in memory`);
      return;
    }

    try {
      const { studentId, loginData } = useAuthStore.getState();

      if (!studentId || !loginData) {
        throw new Error("User not authenticated");
      }
      
      const { getAttendanceData } = await import("@/src/services/database");
      const cached = await getAttendanceData(studentId, monthKey);

      if (cached) {
        set((state) => ({
          monthlyData: {
            ...state.monthlyData,
            [monthKey]: {
              subjectWiseAttendance: cached.subjectWiseData,
              dateWiseAttendance: cached.dateWiseData,
            },
          },
          loading: false,
        }));
      } else {
        set({ loading: true, error: null });
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
      set((state) => {
        const hasData = !!state.monthlyData[monthKey];
        return {
          error: hasData
            ? null
            : error.message || "Failed to fetch attendance data",
          loading: false,
        };
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

  getClassByIdentifier: (date: string, empCode: string, periodName: string) => {
    // Extract year and month from date
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    const subjectWiseData = get().getSubjectWiseData(year, month);
    if (!subjectWiseData) return null;

    // Extract period number for comparison
    const periodNumber = periodName.split(" ")[0];

    // Find matching class
    return (
      subjectWiseData.find((classItem) => {
        const classDate = classItem.date1.split("T")[0];
        const classPeriod = classItem.Period_name.split(" ")[0];
        return (
          classDate === date.split("T")[0] &&
          classItem.emp_code === empCode &&
          classPeriod === periodNumber
        );
      }) || null
    );
  },

  setSelectedClass: (classData: SubjectWiseAttendance | null) => {
    set({ selectedClass: classData });
  },

  clearAttendanceData: async () => {
    try {
      const { studentId } = useAuthStore.getState();
      if (studentId) {
        const { deleteAttendanceData } = await import(
          "@/src/services/database"
        );
        await deleteAttendanceData(studentId);
      }
      set({ monthlyData: {}, loading: false, error: null });
    } catch (error) {
      console.error("Error clearing attendance data:", error);
      set({ monthlyData: {}, loading: false, error: null });
    }
  },
}));
