import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAlertStore } from '@/src/store/alertStore';

import { useVirtualLabsStore } from '../store/virtualLabsStore';

interface DropdownOption {
  label: string;
  value: string;
}

export function useCourseSelectionData() {
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const {
    courses,
    loading,
    error,
    fetchCourses,
    fetchExperiments,
    clearError,
    selectionCourse: selectedCourse,
    selectionStream: selectedStream,
    selectionSemester: selectedSemester,
    setSelectionCourse,
    setSelectionStream,
    setSelectionSemester,
  } = useVirtualLabsStore();

  const [courseDropdownVisible, setCourseDropdownVisible] = useState(false);
  const [streamDropdownVisible, setStreamDropdownVisible] = useState(false);
  const [semesterDropdownVisible, setSemesterDropdownVisible] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (error) {
      showAlert({
        title: 'Error',
        message: error,
        onConfirm: () => {
          clearError();
        },
      });
    }
  }, [error, clearError, showAlert]);

  const courseOptions: DropdownOption[] = Array.from(
    new Set(courses.map((c) => c.course_name)),
  ).map((name) => ({
    label: name,
    value: name,
  }));

  const streamOptions: DropdownOption[] = selectedCourse
    ? Array.from(
        new Set(
          courses
            .filter((c) => c.course_name === selectedCourse)
            .map((c) => c.stream_name),
        ),
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
                  c.course_name === selectedCourse && c.stream_name === selectedStream,
              )
              .map((c) => c.sem_no),
          ),
        )
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((sem) => ({
            label: `Semester ${sem}`,
            value: sem,
          }))
      : [];

  const handleCourseSelect = (value: string) => {
    setSelectionCourse(value);
    setCourseDropdownVisible(false);
  };

  const handleStreamSelect = (value: string) => {
    setSelectionStream(value);
    setStreamDropdownVisible(false);
  };

  const handleSemesterSelect = (value: string) => {
    setSelectionSemester(value);
    setSemesterDropdownVisible(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleProceed = () => {
    fetchExperiments(selectedCourse, selectedStream, selectedSemester);
    router.push('/virtual-labs/experiments');
  };

  return {
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
    handleBack,
    handleProceed,
  };
}
