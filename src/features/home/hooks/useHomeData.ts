import { useAttendanceStore } from "@/src/features/academics/store/attendanceStore";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import {
  extractDateFromISO,
  formatTime,
  getCurrentDateComponents,
  getCurrentMinutes,
  getTodayString,
  parsePeriodDetails,
} from "@/src/utils/dateHelpers";
import { useEffect, useState } from "react";

export function useHomeData() {
  const { studentId, loginData, userData, isLoggedIn, cachedAttendancePercentage } = useAuthStore();
  const { fetchMonthAttendance, getSubjectWiseData } = useAttendanceStore();

  const [attendanceData, setAttendanceData] = useState<{
    total_class: number;
    attd: number;
    pcent: number;
  } | null>(() => cachedAttendancePercentage ?? null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    if (isLoggedIn && studentId && loginData) {
      loadAttendance();
      loadMonthlyAttendance();
    }
  }, [isLoggedIn, studentId, loginData]);

  const loadAttendance = async () => {
    if (!isLoggedIn || !studentId || !loginData) return;

    try {
      if (!attendanceData) setLoadingAttendance(true);

      const { syncAttendancePercentage } = await import("@/src/services/sync");
      const result = await syncAttendancePercentage(
        studentId,
        loginData.college_id,
        loginData.branch_id
      );

      setAttendanceData(result.data);
    } catch (error: any) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const loadMonthlyAttendance = async () => {
    if (!isLoggedIn || !studentId || !loginData) return;

    try {
      const { year, month } = getCurrentDateComponents();
      await fetchMonthAttendance(year, month);
    } catch (error: any) {
      console.error("Failed to load monthly attendance:", error);
    }
  };

  const getNextClass = () => {
    const { year, month } = getCurrentDateComponents();
    const monthData = getSubjectWiseData(year, month);

    const todayStr = getTodayString();

    let todayClasses =
      monthData?.filter((cls) => {
        const classDate = extractDateFromISO(cls.date1);
        return classDate === todayStr;
      }) || [];

    if (todayClasses.length === 0) {
      const today = new Date();
      const previousWeekDate = new Date(today);
      previousWeekDate.setDate(previousWeekDate.getDate() - 7);

      const prevYear = previousWeekDate.getFullYear();
      const prevMonth = previousWeekDate.getMonth() + 1;
      const prevMonthData = getSubjectWiseData(prevYear, prevMonth);

      if (prevMonthData) {
        const prevWeekStr = previousWeekDate.toISOString().split("T")[0];

        todayClasses = prevMonthData.filter((cls) => {
          const classDate = extractDateFromISO(cls.date1);
          return classDate === prevWeekStr;
        });

        if (todayClasses.length > 0) {
          todayClasses = todayClasses.map((cls) => ({
            ...cls,
            _isFallback: true,
          }));
        }
      }
    }

    if (todayClasses.length === 0) return null;

    const currentMinutes = getCurrentMinutes();

    for (const cls of todayClasses) {
      const details = parsePeriodDetails(cls.Period_name);
      if (!details) continue;

      const classStartMinutes =
        details.start.hours * 60 + details.start.minutes;

      if (classStartMinutes > currentMinutes) {
        return cls;
      }
    }

    return null;
  };

  const getFormattedTime = (periodName: string) => {
    const details = parsePeriodDetails(periodName);
    if (!details) return { time: "N/A", period: "AM" as const };
    const formatted = formatTime(details.start.hours, details.start.minutes);
    const [time, period] = formatted.split(" ");
    return { time, period: period as "AM" | "PM" };
  };

  return {
    studentId,
    loginData,
    userData,
    isLoggedIn,
    attendanceData,
    loadingAttendance,
    getNextClass,
    getFormattedTime,
  };
}
