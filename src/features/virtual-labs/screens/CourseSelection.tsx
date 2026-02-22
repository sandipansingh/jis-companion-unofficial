import { Button, Header, HeaderCard } from "@/src/components";
import { useRouter } from "expo-router";
import { FlaskConical } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { CourseDropdown } from "../components";
import { useCourseSelectionData } from "../hooks/useCourseSelectionData";

export default function CourseSelection() {
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
      <View className="flex-1 bg-base">
        <Header title="Virtual Labs" showBackButton />
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#2B5BDB" />
          <Text
            className="text-sm text-ink-500 font-sans"
          >
            Loading courses...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Virtual Labs" showBackButton />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-2 gap-5">
          <HeaderCard
            variant="hero"
            title="Lab Configuration"
            description="Select your course details to view available virtual experiments."
            icon={FlaskConical}
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
              title="View Experiments"
              onPress={handleProceed}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
