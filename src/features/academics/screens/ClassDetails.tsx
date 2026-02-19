import { Header, PdfPreviewModal } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  AttendanceStatusCard,
  ClassInfoCard,
  DateInfoCard,
  ResourcesCard,
} from "@/src/features/academics/components";
import { useClassDetails } from "@/src/features/academics/hooks";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ClassDetails() {
  const { colors } = useTheme();
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

  return (
    <View className="flex-1" style={{ backgroundColor: colors.base }}>
      <Header title="Class Details" showBackButton />

      {/* Main Content */}
      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !classData ? (
        <View className="flex-1 justify-center items-center">
          <Text style={{ color: colors.text }}>Class data not found</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="p-4">
            <ClassInfoCard
              subjectName={subject.name}
              timeRange={timeRange}
              classType={classType}
              facultyName={classData.faculty || "Unknown"}
              location={location}
            />

            <DateInfoCard date={classData.date1 || ""} />

            {!isFutureClass && statValue?.trim() && (
              <AttendanceStatusCard status={statValue} />
            )}

            <ResourcesCard
              resources={resources}
              onResourcePress={openPdfPreview}
            />
          </View>
        </ScrollView>
      )}

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
