import { Text, View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAttendanceStore } from "@/src/store/attendanceStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import {
  extractDateFromISO,
  formatDate,
  formatTime,
  getDayName,
  getMonthName,
  getStartOfWeek,
  getWeekDates,
  isClassInFuture,
  isSameDay,
  parseTimeSlot,
} from "@/src/utils/dateHelpers";
import { parseSubjectName } from "@/src/utils/stringHelpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function AcademicsScreen() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
  const { fetchMonthAttendance, getDateWiseData, getSubjectWiseData } =
    useAttendanceStore();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getStartOfWeek(new Date())
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  useEffect(() => {
    loadWeekData();
  }, [currentWeekStart]);

  const loadWeekData = async () => {
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
          const [year, month] = key.split("-").map(Number);
          return fetchMonthAttendance(year, month);
        })
      );
    } catch (error) {
      console.error("Failed to load week data:", error);
    } finally {
      setLoading(false);
    }
  };

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
        const weekStart = getStartOfWeek(date);
        setCurrentWeekStart(weekStart);
        setSelectedDate(date);
      }
    }
  };

  const confirmDateSelection = () => {
    const weekStart = getStartOfWeek(tempDate);
    setCurrentWeekStart(weekStart);
    setSelectedDate(tempDate);
    setShowDatePicker(false);
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

    return subjectWiseData.filter(
      (d) => extractDateFromISO(d.date1) === dateStr
    );
  };

  const getRoutineWithFallback = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const isCurrentOrFutureDate = compareDate >= today;

    let routine = getRoutineForDate(date);

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
    date: Date
  ): "present" | "absent" | "partial" | "holiday" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate > today) {
      return "holiday";
    }

    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      return "holiday";
    }

    const attendance = getAttendanceWithFallback(date);

    if (dayOfWeek === 6 && !attendance) {
      return "holiday";
    }

    if (!attendance) return "absent";

    if (attendance.rtCount === 0) return "holiday";

    if ((attendance as any)._isFallback) return "holiday";

    const percentage = (attendance.rtPresent / attendance.rtCount) * 100;
    if (percentage === 100) return "present";
    if (percentage === 0) return "absent";
    return "partial";
  };

  const weekDates = getWeekDates(currentWeekStart);
  const currentMonth = weekDates[3];

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
          <View
            style={[styles.attendanceCard, { backgroundColor: colors.surface }]}
          >
            {/* Month Header */}
            <View style={styles.attendanceHeader}>
              <TouchableOpacity
                onPress={handleDateSelect}
                style={styles.monthYearButton}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {getMonthName(currentMonth.getMonth() + 1)}{" "}
                  {currentMonth.getFullYear()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
                <Text
                  style={[styles.todayButtonText, { color: colors.primary }]}
                >
                  Today
                </Text>
              </TouchableOpacity>
            </View>

            {/* Week Navigation */}
            <View style={styles.weekNavigation}>
              <TouchableOpacity
                onPress={goToPreviousWeek}
                style={styles.navButton}
              >
                <ChevronLeft size={32} color={colors.text} />
              </TouchableOpacity>

              <Text style={[styles.weekRange, { color: colors.textSecondary }]}>
                {weekDates[0].getDate()} - {weekDates[6].getDate()}{" "}
                {getMonthName(weekDates[6].getMonth() + 1)}
              </Text>

              <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
                <ChevronRight size={32} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Calendar Strip */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <>
                <View style={styles.calendarStrip}>
                  {weekDates.map((date, idx) => {
                    const status = getAttendanceStatus(date);
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const attendance = getAttendanceWithFallback(date);

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.dayColumn}
                        onPress={() => setSelectedDate(date)}
                      >
                        <Text
                          style={[
                            styles.dayLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {getDayName(date)}
                        </Text>
                        <View
                          style={[
                            styles.dateCircle,
                            status === "present" && styles.presentCircle,
                            status === "absent" && styles.absentCircle,
                            status === "partial" && styles.partialCircle,
                            status === "holiday" && styles.holidayCircle,
                            isSelected && styles.selectedCircle,
                            isToday && styles.todayCircle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dateText,
                              status === "present" && styles.presentText,
                              status === "absent" && styles.absentText,
                              status === "partial" && styles.partialText,
                              status === "holiday" && {
                                color: colors.textSecondary,
                              },
                              isSelected && styles.selectedText,
                            ]}
                          >
                            {date.getDate()}
                          </Text>
                        </View>
                        {attendance && attendance.rtCount > 0 && (
                          <Text
                            style={[
                              styles.classCount,
                              { color: colors.textSecondary },
                              (attendance as any)._isFallback && {
                                opacity: 0.6,
                                fontStyle: "italic",
                              },
                            ]}
                          >
                            {(attendance as any)._isFallback
                              ? `~${attendance.rtCount}`
                              : `${attendance.rtPresent}/${attendance.rtCount}`}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.presentCircle]} />
                    <Text
                      style={[
                        styles.legendText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Present
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.partialCircle]} />
                    <Text
                      style={[
                        styles.legendText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Partial
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.absentCircle]} />
                    <Text
                      style={[
                        styles.legendText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Absent
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Date Picker Modal */}
          {Platform.OS === "ios" ? (
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDatePicker(false)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
                  style={[
                    styles.modalContent,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      Select Date
                    </Text>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    textColor={colors.text}
                    style={{ height: 200 }}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      style={[styles.modalButton, styles.cancelButton]}
                    >
                      <Text
                        style={[styles.modalButtonText, { color: colors.text }]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={confirmDateSelection}
                      style={[
                        styles.modalButton,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                        Select
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )
          )}

          {/* Class Routine Section */}
          {(() => {
            const routine = getRoutineWithFallback(selectedDate);
            if (routine.length === 0) return null;

            const isFallbackData = (routine[0] as any)?._isFallback;

            return (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {isSameDay(selectedDate, new Date())
                    ? "Today's Routine"
                    : `Class Routine - ${selectedDate.getDate()} ${getMonthName(
                        selectedDate.getMonth() + 1
                      )}`}
                  {isFallbackData && (
                    <Text
                      style={[
                        styles.fallbackIndicator,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {" "}
                      (Based on previous week)
                    </Text>
                  )}
                </Text>
                <View style={styles.routineContainer}>
                  {routine.map((classItem, index) => {
                    const hasActualData =
                      !isClassInFuture(
                        classItem.date1,
                        classItem.Period_name
                      ) && !(classItem as any)._isFallback;

                    const statValue = hasActualData
                      ? classItem.stat ||
                        (classItem.present1 === 1 ? "Present" : "Absent")
                      : undefined;

                    const isPresent =
                      statValue?.toLowerCase() === "present" ||
                      classItem.present1 === 1;

                    return (
                      <View key={index} style={styles.routineItem}>
                        {/* Time Column */}
                        <View style={styles.timeColumn}>
                          <Text
                            style={[styles.timeText, { color: colors.text }]}
                          >
                            {getDisplayTime(classItem)}
                          </Text>
                          {/* Vertical Line */}
                          <View style={styles.timelineContainer}>
                            <View style={styles.timelineDot} />
                            {index < routine.length - 1 && (
                              <View style={styles.timelineLine} />
                            )}
                          </View>
                        </View>

                        {/* Class Card */}
                        <TouchableOpacity
                          style={[
                            styles.classCard,
                            { backgroundColor: colors.surface },
                            hasActualData
                              ? isPresent
                                ? styles.presentCard
                                : styles.absentCard
                              : { borderLeftColor: "transparent" },
                          ]}
                          onPress={() => {
                            router.push({
                              pathname: "/class-details",
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
                          }}
                        >
                          <Text
                            style={[styles.subjectName, { color: colors.text }]}
                          >
                            {parseSubjectName(classItem.subject_name).name}
                          </Text>
                          <View style={styles.classDetails}>
                            <View style={styles.detailRow}>
                              <User size={12} color={colors.textSecondary} />
                              <Text
                                style={[
                                  styles.detailText,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                {classItem.faculty}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </>
            );
          })()}
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
  attendanceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  monthYearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  navButton: {
    padding: 8,
  },
  weekRange: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  presentCircle: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  absentCircle: {
    backgroundColor: "#EF444420",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  partialCircle: {
    backgroundColor: "#F59E0B20",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  holidayCircle: {
    backgroundColor: "#F1F5F9",
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  todayCircle: {
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  presentText: {
    color: "#10B981",
  },
  absentText: {
    color: "#EF4444",
  },
  partialText: {
    color: "#F59E0B",
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  classCount: {
    fontSize: 10,
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "transparent",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fallbackIndicator: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  routineContainer: {
    gap: 0,
  },
  routineItem: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  timeColumn: {
    width: 80,
    alignItems: "flex-start",
    paddingTop: 4,
    backgroundColor: "transparent",
    position: "relative",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timelineContainer: {
    position: "absolute",
    left: 8,
    top: 28,
    bottom: 0,
    width: 2,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -4,
    backgroundColor: "#D1D5DB",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 2,
    backgroundColor: "#D1D5DB",
  },
  classCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  presentCard: {
    borderLeftColor: "#10B981",
  },
  absentCard: {
    borderLeftColor: "#EF4444",
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  classDetails: {
    gap: 6,
    backgroundColor: "transparent",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  detailText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    backgroundColor: "transparent",
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
