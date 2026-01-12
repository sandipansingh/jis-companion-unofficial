import { PdfPreviewModal } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  AttendanceStatusCard,
  ClassInfoCard,
  DateInfoCard,
  ResourcesCard,
} from "@/src/features/academics/components";
import { useClassDetails } from "@/src/features/academics/hooks";
import { commonStyles } from "@/src/styles/commonStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClassDetails() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    classData,
    loading,
    subject,
    timeRange,
    classType,
    location,
    isFutureClass,
    statValue,
    resources,
    pdfModalVisible,
    selectedPdf,
    openPdfPreview,
    closePdfPreview,
  } = useClassDetails(id);

  if (loading) {
    return (
      <View
        style={[
          commonStyles.container,
          { backgroundColor: colors.background, justifyContent: "center" },
        ]}
      >
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!classData) {
    return (
      <View
        style={[commonStyles.container, { backgroundColor: colors.background }]}
      >
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.text }}>Class data not found</Text>
        </View>
      </View>
    );
  }

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
            timeRange={timeRange}
            classType={classType}
            facultyName={classData.faculty || "Unknown"}
            location={location}
          />

          <DateInfoCard date={classData.date1 || ""} />

          {!isFutureClass && statValue && statValue.trim() !== "" && (
            <AttendanceStatusCard status={statValue} />
          )}

          <ResourcesCard
            resources={resources}
            onResourcePress={openPdfPreview}
          />
        </View>
      </ScrollView>

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <PdfPreviewModal
          visible={pdfModalVisible}
          url={selectedPdf.url}
          filename={selectedPdf.filename}
          onClose={closePdfPreview}
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
