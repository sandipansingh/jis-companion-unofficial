import { isClassInFuture } from "@/src/utils/dateHelpers";
import { SubjectWiseAttendance } from "../api";

export function getAttendanceStatus(
  classData: SubjectWiseAttendance
): string | undefined {
  const hasActualData =
    !isClassInFuture(classData.date1, classData.Period_name) &&
    !(classData as any)._isFallback;

  if (!hasActualData) return undefined;

  if (classData.stat && classData.stat.trim() !== "") {
    return classData.stat;
  }

  if (classData.present1 === 1) return "Present";
  if (classData.absent1 === 1) return "Absent";

  if (classData.present1 === 0 && classData.absent1 === 0) {
    return "Not Yet Available";
  }

  return "Absent";
}
