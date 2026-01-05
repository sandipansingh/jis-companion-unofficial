import { Text, View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { useVirtualLabsStore } from "@/src/store/virtualLabsStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  FlaskConical,
  PlayCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface DropdownOption {
  label: string;
  value: string;
}

export default function VirtualLabsScreen() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const {
    courses,
    experiments,
    loading,
    error,
    fetchCourses,
    fetchExperiments,
    clearError,
  } = useVirtualLabsStore();

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [showingExperiments, setShowingExperiments] = useState(false);

  const [courseDropdownVisible, setCourseDropdownVisible] = useState(false);
  const [streamDropdownVisible, setStreamDropdownVisible] = useState(false);
  const [semesterDropdownVisible, setSemesterDropdownVisible] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (error) {
      showAlert({
        title: "Error",
        message: error,
        onConfirm: () => {
          clearError();
        },
      });
    }
  }, [error]);

  const courseOptions: DropdownOption[] = Array.from(
    new Set(courses.map((c) => c.course_name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  const streamOptions: DropdownOption[] = selectedCourse
    ? Array.from(
        new Set(
          courses
            .filter((c) => c.course_name === selectedCourse)
            .map((c) => c.stream_name)
        )
      ).map((name) => ({
        label: name,
        value: name,
      }))
    : [];

  const semesterOptions: DropdownOption[] =
    selectedCourse && selectedStream
      ? Array.from(
          new Set(
            courses
              .filter(
                (c) =>
                  c.course_name === selectedCourse &&
                  c.stream_name === selectedStream
              )
              .map((c) => c.sem_no)
          )
        )
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((sem) => ({
            label: `Semester ${sem}`,
            value: sem,
          }))
      : [];

  const handleCourseSelect = (value: string) => {
    setSelectedCourse(value);
    setSelectedStream("");
    setSelectedSemester("");
    setCourseDropdownVisible(false);
  };

  const handleStreamSelect = (value: string) => {
    setSelectedStream(value);
    setSelectedSemester("");
    setStreamDropdownVisible(false);
  };

  const handleSemesterSelect = (value: string) => {
    setSelectedSemester(value);
    setSemesterDropdownVisible(false);

    fetchExperiments(selectedCourse, selectedStream, value);
    setShowingExperiments(true);
  };

  const handleBack = () => {
    if (showingExperiments) {
      setShowingExperiments(false);
    } else {
      router.back();
    }
  };

  const handleExperimentPress = async (link: string) => {
    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        showAlert({
          title: "Error",
          message: "Cannot open this link",
        });
      }
    } catch (error) {
      console.error("Error opening link:", error);
      showAlert({
        title: "Error",
        message: "Failed to open the link",
      });
    }
  };

  const renderDropdown = (
    visible: boolean,
    options: DropdownOption[],
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.dropdownContent, { backgroundColor: colors.surface }]}
        >
          <ScrollView style={styles.dropdownScroll}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                  },
                ]}
                onPress={() => onSelect(option.value)}
              >
                <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderExperimentItem = ({ item }: { item: any }) => (
    <View style={[styles.experimentCard, { backgroundColor: colors.surface }]}>
      <View style={styles.experimentCardHeader}>
        <View
          style={[
            styles.experimentIconBox,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <FlaskConical size={20} color={colors.primary} />
        </View>
        <View style={styles.headerRight}>
          <View
            style={[styles.serialBadge, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.serialText, { color: colors.textSecondary }]}>
              Serial: {item.sl}
            </Text>
          </View>
          {item.subject_code && (
            <Text style={[styles.subjectCode, { color: colors.textSecondary }]}>
              {item.subject_code}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.experimentInfo}>
        <Text style={[styles.experimentName, { color: colors.text }]}>
          {item.experiment}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        onPress={() => handleExperimentPress(item.link)}
        activeOpacity={0.7}
      >
        <PlayCircle size={18} color={colors.primary} />
        <Text style={[styles.startButtonText, { color: colors.primary }]}>
          Start Simulation
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          {showingExperiments ? "Available Experiments" : "Virtual Lab"}
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      {!showingExperiments ? (
        <ScrollView style={commonStyles.scrollView}>
          <View style={styles.content}>
            {/* Info Card with Icon */}
            <View
              style={[styles.infoCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <FlaskConical size={40} color={colors.primary} />
              </View>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Lab Configuration
              </Text>
              <Text
                style={[
                  styles.infoDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Select your course details to view available virtual
                experiments.
              </Text>
            </View>

            {/* Course Dropdown */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>COURSE</Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setCourseDropdownVisible(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    {
                      color: selectedCourse
                        ? colors.text
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {selectedCourse || "Select Course"}
                </Text>
                <ChevronDown size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Stream Dropdown */}
            {selectedCourse && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  STREAM
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setStreamDropdownVisible(true)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: selectedStream
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {selectedStream || "Select Stream"}
                  </Text>
                  <ChevronDown size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            {/* Semester Dropdown */}
            {selectedCourse && selectedStream && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  SEMESTER
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSemesterDropdownVisible(true)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: selectedSemester
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {selectedSemester
                      ? `Semester ${selectedSemester}`
                      : "Select Semester"}
                  </Text>
                  <ChevronDown size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            {/* Proceed Button */}
            {selectedCourse && selectedStream && selectedSemester && (
              <TouchableOpacity
                style={[
                  styles.proceedButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => {
                  fetchExperiments(
                    selectedCourse,
                    selectedStream,
                    selectedSemester
                  );
                  setShowingExperiments(true);
                }}
              >
                <Text style={styles.proceedButtonText}>Proceed to Labs</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.experimentsContainer}>
          {loading ? (
            <View style={commonStyles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[
                  commonStyles.loadingText,
                  { color: colors.textSecondary },
                ]}
              >
                Loading experiments...
              </Text>
            </View>
          ) : experiments.length === 0 ? (
            <View style={commonStyles.centerContainer}>
              <Text
                style={[
                  commonStyles.emptyText,
                  { color: colors.textSecondary },
                ]}
              >
                No experiments available
              </Text>
            </View>
          ) : (
            <FlatList
              data={experiments}
              renderItem={renderExperimentItem}
              keyExtractor={(item, index) => `${item.sl}-${index}`}
              contentContainerStyle={[
                styles.listContainer,
                { paddingBottom: bottomOffset + 20 },
              ]}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {/* Dropdowns */}
      {renderDropdown(
        courseDropdownVisible,
        courseOptions,
        handleCourseSelect,
        () => setCourseDropdownVisible(false)
      )}
      {renderDropdown(
        streamDropdownVisible,
        streamOptions,
        handleStreamSelect,
        () => setStreamDropdownVisible(false)
      )}
      {renderDropdown(
        semesterDropdownVisible,
        semesterOptions,
        handleSemesterSelect,
        () => setSemesterDropdownVisible(false)
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
    padding: 24,
  },
  infoCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dropdownContent: {
    width: "100%",
    maxHeight: "70%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  proceedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  experimentsContainer: {
    flex: 1,
  },
  selectionCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  selectionInfo: {
    backgroundColor: "transparent",
  },
  selectionCourse: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  selectionDetails: {
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  experimentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  experimentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  experimentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  serialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  serialText: {
    fontSize: 10,
    fontWeight: "700",
  },
  experimentInfo: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  experimentName: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
