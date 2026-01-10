import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  AttendanceCalendar,
  ClassRoutineSection,
  DatePickerModal,
} from "@/src/features/academics/components";
import { useAcademicsData } from "@/src/features/academics/hooks";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { getWeekDates, isClassInFuture } from "@/src/utils/dateHelpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";

export default function Academics() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
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

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setTempDate(date);
      if (Platform.OS === "android") {
        handleWeekChange(date);
      }
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
    const hasActualData =
      !isClassInFuture(classItem.date1, classItem.Period_name) &&
      !(classItem as any)._isFallback;

    const statValue = hasActualData
      ? classItem.stat || (classItem.present1 === 1 ? "Present" : "Absent")
      : undefined;

    router.push({
      pathname: "/academics/class-details",
      params: {
        date1: classItem.date1,
        subject_name: classItem.subject_name,
        faculty: classItem.faculty,
        emp_code: classItem.emp_code,
        Period_name: classItem.Period_name,
        ...(statValue && { stat: statValue }),
        ...(hasActualData && {
          upload1: classItem.upload1 || "",
          upload2: classItem.upload2 || "",
          upload3: classItem.upload3 || "",
          upload4: classItem.upload4 || "",
          upload5: classItem.upload5 || "",
        }),
      },
    });
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Academics
        </Text>
      </View>

      <ScrollView
        style={commonStyles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          {/* Attendance Calendar */}
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

          {/* Date Picker Modal */}
          <DatePickerModal
            visible={showDatePicker}
            date={tempDate}
            onClose={() => setShowDatePicker(false)}
            onChange={onDateChange}
            onConfirm={confirmDateSelection}
          />

          {/* Class Routine Section */}
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

const styles = StyleSheet.create({
  header: {
    ...commonStyles.header,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
  },
});
