import { PdfPreviewModal } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  AttendanceStatusCard,
  ClassInfoCard,
  DateInfoCard,
  ResourcesCard,
} from "@/src/features/academics/components";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { commonStyles } from "@/src/styles/commonStyles";
import {
  formatTime,
  isClassInFuture,
  parseTimeSlot,
} from "@/src/utils/dateHelpers";
import { getFileName, parseSubjectName } from "@/src/utils/stringHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
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

export default function ClassDetails() {
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
  ]
    .filter((url): url is string => url !== undefined && url?.trim() !== "")
    .map((url) => ({
      filename: getFileName(url),
      url,
    }));

  const handleResourcePress = (url: string) => {
    const filename = getFileName(url);
    setSelectedPdf({ url, filename });
    setPdfModalVisible(true);
  };

  const subject = parseSubjectName(params.subject_name || "");
  const isFutureClass = isClassInFuture(
    params.date1 || "",
    params.Period_name || ""
  );
  const classType = params.subject_name?.toLowerCase().includes("lab")
    ? "LAB"
    : "THEORY";
  const location = `${loginData?.college_sht_name || "College Name"} Campus`;

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
          <ClassInfoCard
            subjectName={subject.name}
            timeRange={getTimeRange()}
            classType={classType}
            facultyName={params.faculty || "Unknown"}
            location={location}
          />

          <DateInfoCard date={params.date1 || ""} />

          {!isFutureClass && params.stat && params.stat.trim() !== "" && (
            <AttendanceStatusCard status={params.stat} />
          )}

          <ResourcesCard
            resources={resources}
            onResourcePress={handleResourcePress}
          />
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
});
