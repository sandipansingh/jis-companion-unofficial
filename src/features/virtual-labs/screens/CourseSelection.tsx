import { Button, HeaderCard, Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { ChevronLeft, FlaskConical } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CourseDropdown } from "../components";
import { useCourseSelectionData } from "../hooks/useCourseSelectionData";

export default function CourseSelection() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    courses,
    loading,
    selectedCourse,
    selectedStream,
    selectedSemester,
    courseOptions,
    streamOptions,
    semesterOptions,
    courseDropdownVisible,
    streamDropdownVisible,
    semesterDropdownVisible,
    setCourseDropdownVisible,
    setStreamDropdownVisible,
    setSemesterDropdownVisible,
    handleCourseSelect,
    handleStreamSelect,
    handleSemesterSelect,
    handleProceed,
  } = useCourseSelectionData();

  if (loading && courses.length === 0) {
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
            Virtual Labs
          </Text>
          <View style={commonStyles.placeholder} />
        </View>
        <View style={commonStyles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[commonStyles.loadingText, { color: colors.textSecondary }]}
          >
            Loading courses...
          </Text>
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
          Virtual Labs
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView style={commonStyles.scrollView}>
        <View style={styles.content}>
          <HeaderCard
            title="Lab Configuration"
            description="Select your course details to view available virtual experiments."
            icon={FlaskConical}
            iconSize={40}
            iconCircleSize={80}
          />

          <CourseDropdown
            label="COURSE"
            value={selectedCourse}
            placeholder="Select Course"
            options={courseOptions}
            visible={courseDropdownVisible}
            onOpen={() => setCourseDropdownVisible(true)}
            onClose={() => setCourseDropdownVisible(false)}
            onSelect={handleCourseSelect}
          />

          {selectedCourse && (
            <CourseDropdown
              label="STREAM"
              value={selectedStream}
              placeholder="Select Stream"
              options={streamOptions}
              visible={streamDropdownVisible}
              onOpen={() => setStreamDropdownVisible(true)}
              onClose={() => setStreamDropdownVisible(false)}
              onSelect={handleStreamSelect}
            />
          )}

          {selectedCourse && selectedStream && (
            <CourseDropdown
              label="SEMESTER"
              value={selectedSemester ? `Semester ${selectedSemester}` : ""}
              placeholder="Select Semester"
              options={semesterOptions}
              visible={semesterDropdownVisible}
              onOpen={() => setSemesterDropdownVisible(true)}
              onClose={() => setSemesterDropdownVisible(false)}
              onSelect={handleSemesterSelect}
            />
          )}

          {selectedCourse && selectedStream && selectedSemester && (
            <Button
              title="Proceed to Labs"
              onPress={handleProceed}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </ScrollView>
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
    padding: 20,
  },
});
