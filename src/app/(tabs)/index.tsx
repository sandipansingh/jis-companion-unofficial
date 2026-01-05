import { Text, View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useAttendanceStore } from "@/src/store/attendanceStore";
import { useAuthStore } from "@/src/store/authStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import {
  extractDateFromISO,
  formatTime,
  getCurrentDateComponents,
  getCurrentMinutes,
  getTodayString,
  parsePeriodDetails,
} from "@/src/utils/dateHelpers";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { FlaskConical, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const MENU_ITEMS = [
  {
    id: "virtual_labs",
    title: "Virtual Labs",
    icon: FlaskConical,
    color: "#3B82F6",
  },
];

// const MENU_ITEMS = [
//   {
//     id: "virtual_labs",
//     title: "Virtual Labs",
//     icon: FlaskConical,
//     color: "#3B82F6",
//   },
//   { id: "events", title: "Events", icon: Calendar, color: "#F59E0B" },
//   {
//     id: "utility_tools",
//     title: "Utility & Tools",
//     icon: Wrench,
//     color: "#10B981",
//   },
//   {
//     id: "notifications",
//     title: "Notifications",
//     icon: Bell,
//     color: "#8B5CF6",
//   },
//   {
//     id: "library_status",
//     title: "Library Status",
//     icon: Bookmark,
//     color: "#22C55E",
//   },
//   {
//     id: "online_payment",
//     title: "Online Payment",
//     icon: CreditCard,
//     color: "#6366F1",
//   },
//   {
//     id: "library_search",
//     title: "Library Search",
//     icon: Book,
//     color: "#059669",
//   },
//   { id: "placement", title: "Placement", icon: Briefcase, color: "#0EA5E9" },
//   {
//     id: "record_video",
//     title: "Record Video",
//     icon: Video,
//     color: "#DC2626",
//   },
//   {
//     id: "profile_video",
//     title: "Profile Video",
//     icon: UserCircle,
//     color: "#2563EB",
//   },
//   {
//     id: "video_lecture",
//     title: "Video Lecture",
//     icon: Play,
//     color: "#16A34A",
//   },
//   { id: "handbook", title: "Handbook", icon: FileText, color: "#84CC16" },
//   { id: "feedback", title: "Feedback", icon: MessageCircle, color: "#F87171" },
// ];

export default function HomeScreen() {
  const { studentId, loginData, userData, isLoggedIn } = useAuthStore();
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const { fetchMonthAttendance, getSubjectWiseData } = useAttendanceStore();
  const { showAlert } = useAlertStore();
  const [attendanceData, setAttendanceData] = useState<{
    total_class: number;
    attd: number;
    pcent: number;
  } | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    if (isLoggedIn && studentId && loginData) {
      loadAttendance();
      loadMonthlyAttendance();
    }
  }, [isLoggedIn, studentId, loginData]);

  const loadAttendance = async () => {
    if (!isLoggedIn || !studentId || !loginData) return;

    try {
      setLoadingAttendance(true);

      const { syncAttendancePercentage } = await import("@/src/services/sync");
      const result = await syncAttendancePercentage(
        studentId,
        loginData.college_id,
        loginData.branch_id
      );

      setAttendanceData(result.data);
    } catch (error: any) {
      console.error("Failed to load attendance:", error);

      const { getAttendancePercentage } = await import(
        "@/src/services/database"
      );
      const cachedData = await getAttendancePercentage(studentId);
      if (cachedData) {
        setAttendanceData(cachedData);
      }
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

  const nextClass = getNextClass();

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleMenuItemPress = (itemId: string) => {
    if (itemId === "virtual_labs") {
      router.push("/virtual-labs");
    } else {
      showAlert({
        title:
          MENU_ITEMS.find((item) => item.id === itemId)?.title || "Feature",
        message: "Coming soon!",
      });
    }
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Welcome Card */}
      <LinearGradient
        colors={[colors.primary, "#222a68"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeCard}
      >
        <View style={styles.welcomeHeader}>
          {userData?.profile_pict_cur_url ? (
            <Image
              source={{ uri: userData.profile_pict_cur_url }}
              style={styles.avatarContainer}
            />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getInitials(loginData?.student_name || "Student")}
              </Text>
            </View>
          )}
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeSubtext}>Welcome back,</Text>
            <Text style={styles.welcomeName}>
              {loginData?.student_name || "Student"}
            </Text>
            <Text style={styles.welcomeCourse}>
              {loginData?.batch_name || "CSE"} •{" "}
              {loginData?.college_sht_name || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.quickStatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            {loadingAttendance ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.statValue}>
                {attendanceData?.pcent || 0}%
              </Text>
            )}
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Days</Text>
            {loadingAttendance ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.statValue}>
                {attendanceData?.attd || 0}/{attendanceData?.total_class || 0}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          {/* Next Class Section */}
          {nextClass && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Up Next
                  {(nextClass as any)._isFallback && (
                    <Text
                      style={[
                        styles.fallbackText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {" "}
                      (Expected)
                    </Text>
                  )}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/academics")}
                >
                  <Text style={[styles.seeAll, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.nextClassCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.timeBox,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.timeText, { color: colors.primary }]}>
                    {getFormattedTime(nextClass.Period_name).time}
                  </Text>
                  <Text
                    style={[styles.timeAmPm, { color: colors.textSecondary }]}
                  >
                    {getFormattedTime(nextClass.Period_name).period}
                  </Text>
                </View>
                <View
                  style={[styles.classInfo, { borderLeftColor: colors.border }]}
                >
                  <Text style={[styles.className, { color: colors.text }]}>
                    {nextClass.subject_name.split(" - ")[1]?.trim() ||
                      nextClass.subject_name}
                  </Text>

                  <View style={styles.upNextClassFacultyRow}>
                    <User size={12} color={colors.textSecondary} />
                    <Text
                      style={[
                        styles.classDetails,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {nextClass.faculty}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Quick Access Grid */}
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, marginTop: 24, marginBottom: 16 },
            ]}
          >
            Quick Access
          </Text>

          <View style={styles.gridContainer}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuItemPress(item.id)}
              >
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <item.icon size={24} color={item.color} />
                </View>
                <Text
                  style={[styles.menuLabel, { color: colors.textSecondary }]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: bottomOffset + 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  welcomeCard: {
    paddingHorizontal: 24,
    paddingTop: Platform.select({ web: 20, default: 60 }),
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  welcomeTextContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  welcomeCourse: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  quickStatsContainer: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
  },
  nextClassCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeBox: {
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  timeAmPm: {
    fontSize: 12,
    marginTop: 2,
  },
  classInfo: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: 16,
    backgroundColor: "transparent",
  },
  className: {
    fontSize: 13,
    fontWeight: "bold",
  },
  classDetails: {
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  menuItem: {
    width: "23%",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 12,
  },
  upNextClassFacultyRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
});
