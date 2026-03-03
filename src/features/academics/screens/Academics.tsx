import { useRouter } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';

import { Header } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import {
  AttendanceCalendar,
  ClassRoutineSection,
  DatePickerModal,
} from '@/src/features/academics/components';
import { useAcademicsData } from '@/src/features/academics/hooks';
import { useAttendanceStore } from '@/src/features/academics/store/attendanceStore';
import { createClassId } from '@/src/features/academics/utils/classId';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';
import { getWeekDates } from '@/src/utils/dateHelpers';

export default function Academics() {
  const { bottomOffset } = useSafeAreaStore();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const router = useRouter();
  const { setSelectedClass } = useAttendanceStore();
  const {
    currentWeekStart,
    selectedDate,
    loading,
    setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    handleWeekChange,
    getRoutineWithFallback,
    getAttendanceWithFallback,
    getDisplayTime,
    getAttendanceStatus,
  } = useAcademicsData();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const handleDateSelect = () => {
    setTempDate(currentWeekStart);
    setShowDatePicker(true);
  };

  const onDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      setTempDate(date);
      if (Platform.OS === 'android') handleWeekChange(date);
    }
  };

  const confirmDateSelection = () => {
    handleWeekChange(tempDate);
    setShowDatePicker(false);
  };

  const weekDates = getWeekDates(currentWeekStart);
  const currentMonth = weekDates[3];
  const routine = getRoutineWithFallback(selectedDate);
  const isFallbackData = (routine[0] as any)?._isFallback;

  const handleClassPress = (classItem: any) => {
    setSelectedClass(classItem);
    const classId = createClassId(
      classItem.date1,
      classItem.emp_code,
      classItem.Period_name,
    );
    router.push(`/academics/class/${classId}`);
  };

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-8 pb-20"
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1280}>
            <Header title="Academics" />

            <View className="flex-row items-start gap-6">
              <View className="w-[380px]" style={{ position: 'sticky' as any, top: 24 }}>
                <AttendanceCalendar
                  currentMonth={currentMonth}
                  weekDates={weekDates}
                  selectedDate={selectedDate}
                  loading={loading}
                  onDateSelect={handleDateSelect}
                  onTodayPress={goToToday}
                  onPreviousWeek={goToPreviousWeek}
                  onNextWeek={goToNextWeek}
                  onDatePress={setSelectedDate}
                  getAttendanceStatus={getAttendanceStatus}
                  getAttendanceWithFallback={getAttendanceWithFallback}
                />

                <DatePickerModal
                  visible={showDatePicker}
                  date={tempDate}
                  onClose={() => setShowDatePicker(false)}
                  onChange={onDateChange}
                  onConfirm={confirmDateSelection}
                />
              </View>

              <View className="flex-1 rounded-[20px] border border-border p-6 min-h-80 bg-surface">
                {routine.length === 0 ? (
                  <View className="flex-1 items-center justify-center py-12 gap-3">
                    <CalendarDays size={40} color={colors.border} />
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-[15px] font-sans-md"
                    >
                      No classes scheduled
                    </Text>
                  </View>
                ) : (
                  <ClassRoutineSection
                    selectedDate={selectedDate}
                    routine={routine}
                    isFallbackData={isFallbackData}
                    getDisplayTime={getDisplayTime}
                    onClassPress={handleClassPress}
                  />
                )}
              </View>
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Academics" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} bounces>
        <View className="p-4">
          <AttendanceCalendar
            currentMonth={currentMonth}
            weekDates={weekDates}
            selectedDate={selectedDate}
            loading={loading}
            onDateSelect={handleDateSelect}
            onTodayPress={goToToday}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            onDatePress={setSelectedDate}
            getAttendanceStatus={getAttendanceStatus}
            getAttendanceWithFallback={getAttendanceWithFallback}
          />

          <DatePickerModal
            visible={showDatePicker}
            date={tempDate}
            onClose={() => setShowDatePicker(false)}
            onChange={onDateChange}
            onConfirm={confirmDateSelection}
          />

          <ClassRoutineSection
            selectedDate={selectedDate}
            routine={routine}
            isFallbackData={isFallbackData}
            getDisplayTime={getDisplayTime}
            onClassPress={handleClassPress}
          />
        </View>

        <View style={{ height: bottomOffset + 100 }} />
      </ScrollView>
    </View>
  );
}
