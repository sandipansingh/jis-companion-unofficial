import PdfPreviewModal from "@/src/components/PdfPreviewModal";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthStore } from "@/src/store/authStore";
import { commonStyles } from "@/src/styles/commonStyles";
import {
  formatTime,
  isClassInFuture,
  parseTimeSlot,
} from "@/src/utils/dateHelpers";
import { getFileName, parseSubjectName } from "@/src/utils/stringHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  FileText,
  MapPin,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ClassDetailsParams {
  date1?: string;
  subject_name?: string;
  faculty?: string;
  emp_code?: string;
  Period_name?: string;
  stat?: string;
  upload1?: string;
  upload2?: string;
  upload3?: string;
  upload4?: string;
  upload5?: string;
}

export default function ClassDetailsScreen() {
  const { colors } = useTheme();
  const { loginData } = useAuthStore();
  const router = useRouter();
  const params = useLocalSearchParams() as ClassDetailsParams;

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const getTimeRange = () => {
    const timeSlot = parseTimeSlot(params.Period_name || "");
    if (!timeSlot) return "";
    return `${formatTime(timeSlot.start)} - ${formatTime(timeSlot.end)}`;
  };

  const resources = [
    params.upload1,
    params.upload2,
    params.upload3,
    params.upload4,
    params.upload5,
  ].filter((url): url is string => url !== undefined && url?.trim() !== "");

  const handleResourcePress = (url: string) => {
    const filename = getFileName(url);
    setSelectedPdf({ url, filename });
    setPdfModalVisible(true);
  };

  const subject = parseSubjectName(params.subject_name || "");
  const isPresent = params.stat === "Present";

  const isFutureClass = isClassInFuture(
    params.date1 || "",
    params.Period_name || ""
  );

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={commonStyles.backButton}
        >
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Class Details
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView style={commonStyles.scrollView}>
        <View style={styles.content}>
          {/* Main Info Card */}
          <View style={[styles.mainCard, { backgroundColor: colors.surface }]}>
            {/* Time Badge and Type Badge Row */}
            <View style={styles.badgeRow}>
              <View style={styles.timeBadge}>
                <Clock size={16} color="#007AFF" />
                <Text style={styles.timeText}>{getTimeRange()}</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {params.subject_name?.toLowerCase().includes("lab")
                    ? "LAB"
                    : "THEORY"}
                </Text>
              </View>
            </View>

            {/* Subject Name */}
            <Text style={[styles.subjectName, { color: colors.text }]}>
              {subject.name}
            </Text>

            {/* Location Row */}
            <View style={styles.locationRow}>
              <MapPin size={16} color="#6B7280" />
              <Text
                style={[styles.locationText, { color: colors.textSecondary }]}
              >
                {loginData?.college_sht_name || "College Name"} {"Campus"}
              </Text>
            </View>

            {/* Faculty Section*/}
            <View
              style={[
                styles.facultySection,
                { backgroundColor: "transparent" },
              ]}
            >
              <View style={[styles.facultyBox, { backgroundColor: "#F3F4F6" }]}>
                <View style={styles.facultyAvatar}>
                  <Text style={styles.avatarText}>
                    {params.faculty
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </Text>
                </View>
                <View style={styles.facultyTextContainer}>
                  <Text
                    style={[
                      styles.facultyLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Faculty
                  </Text>
                  <Text style={[styles.facultyName, { color: colors.text }]}>
                    {params.faculty}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date Card */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View
              style={[styles.cardHeader, { backgroundColor: "transparent" }]}
            >
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Date
              </Text>
            </View>
            <View
              style={[styles.dateContainer, { backgroundColor: "#F0F9FF" }]}
            >
              <View style={styles.dateLeft}>
                <View style={styles.dateIconContainer}>
                  <Calendar size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={[styles.dateMainText, { color: "#0C4A6E" }]}>
                    {new Date(params.date1 || "").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  <Text style={[styles.dateSubtext, { color: "#0369A1" }]}>
                    {new Date(params.date1 || "").toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </Text>
                </View>
              </View>
              <Calendar size={12} color="#0284C7" style={{ opacity: 0.3 }} />
            </View>
          </View>

          {/* Attendance Status Card */}
          {!isFutureClass && params.stat && params.stat.trim() !== "" && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View
                style={[styles.cardHeader, { backgroundColor: "transparent" }]}
              >
                <Text
                  style={[styles.cardLabel, { color: colors.textSecondary }]}
                >
                  Attendance Status
                </Text>
              </View>
              <View
                style={[
                  styles.attendanceContainer,
                  {
                    backgroundColor: isPresent ? "#ECFDF5" : "#FEF2F2",
                  },
                ]}
              >
                <View style={styles.attendanceLeft}>
                  <View
                    style={[
                      styles.attendanceIconContainer,
                      {
                        backgroundColor: isPresent ? "#10B981" : "#EF4444",
                      },
                    ]}
                  >
                    {isPresent ? (
                      <Check size={22} color="#FFFFFF" />
                    ) : (
                      <X size={22} color="#FFFFFF" />
                    )}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.attendanceStatusText,
                        { color: isPresent ? "#065F46" : "#991B1B" },
                      ]}
                    >
                      {params.stat}
                    </Text>
                    <Text
                      style={[
                        styles.attendanceSubtext,
                        { color: isPresent ? "#059669" : "#DC2626" },
                      ]}
                    >
                      {isPresent
                        ? "You attended this class"
                        : "You missed this class"}
                    </Text>
                  </View>
                </View>
                {isPresent ? (
                  <Check size={12} color="#10B981" style={{ opacity: 0.3 }} />
                ) : (
                  <X size={12} color="#EF4444" style={{ opacity: 0.3 }} />
                )}
              </View>
            </View>
          )}

          {/* Resources Card */}
          {resources.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View
                style={[styles.cardHeader, { backgroundColor: "transparent" }]}
              >
                <Text
                  style={[styles.cardLabel, { color: colors.textSecondary }]}
                >
                  Resources
                </Text>
              </View>
              <View style={styles.resourcesList}>
                {resources.map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.resourceItem,
                      { backgroundColor: "#F3F4F6" },
                    ]}
                    onPress={() => handleResourcePress(url)}
                  >
                    <View style={styles.resourceIcon}>
                      <FileText size={20} color="#EF4444" />
                    </View>
                    <Text
                      style={[styles.resourceName, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {getFileName(url)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <PdfPreviewModal
          visible={pdfModalVisible}
          url={selectedPdf.url}
          filename={selectedPdf.filename}
          onClose={() => {
            setPdfModalVisible(false);
            setSelectedPdf(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  content: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  typeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  subjectName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    fontSize: 10,
    fontWeight: "500",
  },
  facultySection: {
    marginTop: 8,
  },
  facultyLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 4,
  },
  facultyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  facultyTextContainer: {
    flex: 1,
  },
  facultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  facultyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C7D2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  facultyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  chatButton: {
    padding: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  attendanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 16,
  },
  attendanceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  attendanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  attendanceStatusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  attendanceSubtext: {
    fontSize: 13,
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 16,
  },
  dateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  dateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0284C7",
    justifyContent: "center",
    alignItems: "center",
  },
  dateMainText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 13,
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "500",
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  resourceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
