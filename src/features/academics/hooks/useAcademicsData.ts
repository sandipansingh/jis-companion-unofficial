import { useCallback, useEffect, useState } from 'react';

import {
  extractDateFromISO,
  formatDate,
  formatTime,
  getStartOfWeek,
  getWeekDates,
  parseTimeSlot,
} from '@/src/utils/dateHelpers';

import { useAttendanceStore } from '../store';

export function useAcademicsData() {
  const { fetchMonthAttendance, getDateWiseData, getSubjectWiseData } =
    useAttendanceStore();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getStartOfWeek(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const loadWeekData = useCallback(async () => {
    setLoading(true);
    try {
      const weekDates = getWeekDates(currentWeekStart);
      const monthsToFetch = new Set<string>();

      weekDates.forEach((date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        monthsToFetch.add(`${year}-${month}`);
      });

      await Promise.all(
        Array.from(monthsToFetch).map((key) => {
          const [year, month] = key.split('-').map(Number);
          return fetchMonthAttendance(year, month);
        }),
      );
    } catch (error) {
      console.error('Failed to load week data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart, fetchMonthAttendance]);

  useEffect(() => {
    loadWeekData();
  }, [loadWeekData]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(getStartOfWeek(today));
    setSelectedDate(today);
  };

  const handleWeekChange = (date: Date) => {
    const weekStart = getStartOfWeek(date);
    setCurrentWeekStart(weekStart);
    setSelectedDate(date);
  };

  const getAttendanceForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateStr = formatDate(date);

    const dateWiseData = getDateWiseData(year, month);
    if (!dateWiseData) return null;

    return dateWiseData.find((d) => extractDateFromISO(d.rtDate) === dateStr);
  };

  const getRoutineForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateStr = formatDate(date);

    const subjectWiseData = getSubjectWiseData(year, month);
    if (!subjectWiseData) return [];

    return subjectWiseData.filter((d) => extractDateFromISO(d.date1) === dateStr);
  };

  const getRoutineWithFallback = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const isCurrentOrFutureDate = compareDate >= today;

    const routine = getRoutineForDate(date);

    if (routine.length === 0 && isCurrentOrFutureDate) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0) return [];

      const previousWeekDate = new Date(date);
      previousWeekDate.setDate(previousWeekDate.getDate() - 7);

      const prevRoutine = getRoutineForDate(previousWeekDate);

      if (prevRoutine.length > 0) {
        return prevRoutine.map((cls) => ({
          ...cls,
          date1: date.toISOString(),
          stat: undefined,
          present1: undefined,
          absent1: undefined,
          _isFallback: true,
        }));
      }
    }

    return routine;
  };

  const getAttendanceWithFallback = (date: Date) => {
    const attendance = getAttendanceForDate(date);

    if (!attendance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);

      if (compareDate >= today) {
        const previousWeekDate = new Date(date);
        previousWeekDate.setDate(previousWeekDate.getDate() - 7);

        const prevAttendance = getAttendanceForDate(previousWeekDate);
        if (prevAttendance && prevAttendance.rtCount > 0) {
          return {
            rtDate: date.toISOString(),
            rtCount: prevAttendance.rtCount,
            rtPresent: 0,
            _isFallback: true,
          };
        }
      }
    }

    return attendance;
  };

  const getDisplayTime = (currentClass: any) => {
    const currentTime = parseTimeSlot(currentClass.Period_name);
    if (!currentTime) return currentClass.Period_name;

    return formatTime(currentTime.start, false);
  };

  const getAttendanceStatus = (
    date: Date,
  ): 'present' | 'absent' | 'partial' | 'holiday' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate > today) {
      return 'holiday';
    }

    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      return 'holiday';
    }

    const attendance = getAttendanceWithFallback(date);

    if (dayOfWeek === 6 && !attendance) {
      return 'holiday';
    }

    if (!attendance) return 'absent';

    if (attendance.rtCount === 0) return 'holiday';

    if ((attendance as any)._isFallback) return 'holiday';

    const percentage = (attendance.rtPresent / attendance.rtCount) * 100;
    if (percentage === 100) return 'present';
    if (percentage === 0) return 'absent';
    return 'partial';
  };

  return {
    currentWeekStart,
    selectedDate,
    loading,
    setSelectedDate,
    loadWeekData,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    handleWeekChange,
    getAttendanceForDate,
    getRoutineForDate,
    getRoutineWithFallback,
    getAttendanceWithFallback,
    getDisplayTime,
    getAttendanceStatus,
  };
}
