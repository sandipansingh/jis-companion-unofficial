import { useAuthStore } from "@/src/features/auth/store/authStore";
import {
  formatTime,
  isClassInFuture,
  parseTimeSlot,
} from "@/src/utils/dateHelpers";
import { getFileName, parseSubjectName } from "@/src/utils/stringHelpers";
import { useEffect, useState } from "react";
import { useAttendanceStore } from "../store";
import { SubjectWiseAttendance } from "../types";
import { getAttendanceStatus } from "../utils/attendanceHelpers";
import { parseClassId } from "../utils/classId";

interface Resource {
  filename: string;
  url: string;
}

interface UseClassDetailsReturn {
  classData: SubjectWiseAttendance | null;
  loading: boolean;
  subject: {
    name: string;
    code: string;
  };
  timeRange: string;
  classType: "LAB" | "THEORY";
  location: string;
  isFutureClass: boolean;
  statValue: string | undefined;
  resources: Resource[];
  pdfModalVisible: boolean;
  selectedPdf: { url: string; filename: string } | null;
  openPdfPreview: (url: string) => void;
  closePdfPreview: () => void;
}

export function useClassDetails(classId?: string): UseClassDetailsReturn {
  const { loginData } = useAuthStore();
  const { selectedClass, getClassByIdentifier } = useAttendanceStore();

  const [classData, setClassData] = useState<SubjectWiseAttendance | null>(
    selectedClass
  );
  const [loading, setLoading] = useState(!selectedClass);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    if (!classData && classId) {
      const parsed = parseClassId(classId);

      if (parsed) {
        const { date, empCode, periodName } = parsed;
        const fullDate = `${date}T00:00:00`;
        const classItem = getClassByIdentifier(fullDate, empCode, periodName);

        if (classItem) {
          setClassData(classItem);
        }
      }

      setLoading(false);
    }
  }, [classId, classData, getClassByIdentifier]);

  const getTimeRange = (): string => {
    if (!classData) return "";
    const timeSlot = parseTimeSlot(classData.Period_name || "");
    if (!timeSlot) return "";
    return `${formatTime(timeSlot.start)} - ${formatTime(timeSlot.end)}`;
  };

  const getResources = (): Resource[] => {
    if (!classData) return [];

    return [
      classData.upload1,
      classData.upload2,
      classData.upload3,
      classData.upload4,
      classData.upload5,
    ]
      .filter((url): url is string => url !== undefined && url?.trim() !== "")
      .map((url) => ({
        filename: getFileName(url),
        url,
      }));
  };

  const openPdfPreview = (url: string) => {
    const filename = getFileName(url);
    setSelectedPdf({ url, filename });
    setPdfModalVisible(true);
  };

  const closePdfPreview = () => {
    setPdfModalVisible(false);
    setSelectedPdf(null);
  };

  const subject = classData
    ? parseSubjectName(classData.subject_name || "")
    : { name: "", code: "" };

  const isFutureClass = classData
    ? isClassInFuture(classData.date1 || "", classData.Period_name || "")
    : false;

  const classType: "LAB" | "THEORY" = classData?.subject_name
    ?.toLowerCase()
    .includes("lab")
    ? "LAB"
    : "THEORY";

  const location = `${loginData?.college_sht_name || "College Name"} Campus`;

  const statValue = classData ? getAttendanceStatus(classData) : undefined;

  return {
    classData,
    loading,
    subject,
    timeRange: getTimeRange(),
    classType,
    location,
    isFutureClass,
    statValue,
    resources: getResources(),
    pdfModalVisible,
    selectedPdf,
    openPdfPreview,
    closePdfPreview,
  };
}
