import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { UserProfileData } from "@/src/features/auth/api/auth";
import { Award, Briefcase, Calculator } from "lucide-react-native";
import { AcademicCard } from "./AcademicCard";
import { SemesterRow } from "./SemesterRow";
import { SubjectRow } from "./SubjectRow";

interface AcademicTabContentProps {
  userData?: UserProfileData;
  hasAcademicHistoryData: () => boolean;
  hasValidMarks: (marks?: number | string) => boolean;
  hasSubjectMarks: () => boolean;
  getSemesterResults: () => Array<{ sem: number; sgpa?: number | string }>;
}

export function AcademicTabContent({
  userData,
  hasAcademicHistoryData,
  hasValidMarks,
  hasSubjectMarks,
  getSemesterResults,
}: AcademicTabContentProps) {
  const { isDark } = useTheme();
  return (
    <View>
      {/* Academic History Section */}
      {hasAcademicHistoryData() && (
        <View className="mt-1 mb-4">
          <View className="flex-row items-center gap-2 mb-2 pb-1">
            <Briefcase size={16} color={isDark ? "#60A5FA" : "#2B5BDB"} />
            <Text
              className="text-sm text-ink-900 dark:text-white"
              style={{ fontFamily: "GeneralSans-Bold" }}
            >
              Academic History
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-3 mb-4">
            {hasValidMarks(userData?.marks_x) && (
              <AcademicCard title="Class X" score={`${userData?.marks_x}%`} />
            )}
            {hasValidMarks(userData?.marks_xii) && (
              <AcademicCard title="Class XII" score={`${userData?.marks_xii}%`} />
            )}
            {hasValidMarks(userData?.marks_dip) && (
              <AcademicCard title="Diploma" score={`${userData?.marks_dip}%`} />
            )}
            {hasValidMarks(userData?.marks_graduate) && (
              <AcademicCard title="Graduation" score={`${userData?.marks_graduate}%`} />
            )}
            {hasValidMarks(userData?.marks_pg) && (
              <AcademicCard title="Post Grad" score={`${userData?.marks_pg}%`} />
            )}
          </View>
        </View>
      )}

      {/* Subject Marks Section */}
      {hasSubjectMarks() && (
        <View className="mt-1 mb-4">
          <View className="flex-row items-center gap-2 mb-2 pb-1">
            <Calculator size={16} color={isDark ? "#60A5FA" : "#2B5BDB"} />
            <Text
              className="text-sm text-ink-900 dark:text-white"
              style={{ fontFamily: "GeneralSans-Bold" }}
            >
              Class XII Marks
            </Text>
          </View>
          <View
            className="rounded-xl p-4 gap-1 mb-4 border border-border"
          >
            {hasValidMarks(userData?.std_student_master_physics_obt_marks) && (
              <SubjectRow
                subject="Physics"
                obtained={userData?.std_student_master_physics_obt_marks || 0}
                full={userData?.std_student_master_physics_full_marks || 0}
              />
            )}
            {hasValidMarks(userData?.std_student_master_chemistry_obt_marks) && (
              <SubjectRow
                subject="Chemistry"
                obtained={userData?.std_student_master_chemistry_obt_marks || 0}
                full={userData?.std_student_master_chemistry_full_marks || 0}
              />
            )}
            {hasValidMarks(userData?.std_student_master_math_obt_marks) && (
              <SubjectRow
                subject="Mathematics"
                obtained={userData?.std_student_master_math_obt_marks || 0}
                full={userData?.std_student_master_math_full_marks || 0}
              />
            )}
            {hasValidMarks(userData?.std_student_master_english_obt_marks) && (
              <SubjectRow
                subject="English"
                obtained={userData?.std_student_master_english_obt_marks || 0}
                full={userData?.std_student_master_english_full_marks || 0}
              />
            )}
          </View>
        </View>
      )}

      {/* Semester Results Section */}
      <View className="mt-1">
        <View className="flex-row items-center gap-2 mb-2 pb-1">
          <Award size={16} color={isDark ? "#60A5FA" : "#2B5BDB"} />
          <Text
            className="text-sm text-ink-900 dark:text-white"
            style={{ fontFamily: "GeneralSans-Bold" }}
          >
            Semester Results
          </Text>
        </View>
        <View className="gap-3">
          {getSemesterResults().map((result) => (
            <SemesterRow
              key={result.sem}
              semester={result.sem}
              sgpa={result.sgpa}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
