import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { UserProfileData } from "@/src/features/auth/api/auth";
import { Award, Briefcase, Calculator } from "lucide-react-native";
import { StyleSheet } from "react-native";
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
  const { colors } = useTheme();

  return (
    <View style={styles.tabContentInner}>
      {/*  Academic History Section */}
      {hasAcademicHistoryData() && (
        <View style={styles.academicSection}>
          <View style={styles.sectionHeader}>
            <Briefcase size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Academic History
            </Text>
          </View>
          <View style={styles.academicGrid}>
            {hasValidMarks(userData?.marks_x) && (
              <AcademicCard title="Class X" score={`${userData?.marks_x}%`} />
            )}
            {hasValidMarks(userData?.marks_xii) && (
              <AcademicCard
                title="Class XII"
                score={`${userData?.marks_xii}%`}
              />
            )}
            {hasValidMarks(userData?.marks_dip) && (
              <AcademicCard title="Diploma" score={`${userData?.marks_dip}%`} />
            )}
            {hasValidMarks(userData?.marks_graduate) && (
              <AcademicCard
                title="Graduation"
                score={`${userData?.marks_graduate}%`}
              />
            )}
            {hasValidMarks(userData?.marks_pg) && (
              <AcademicCard
                title="Post Grad"
                score={`${userData?.marks_pg}%`}
              />
            )}
          </View>
        </View>
      )}

      {/* Subject Marks Section */}
      {hasSubjectMarks() && (
        <View style={styles.academicSection}>
          <View style={styles.sectionHeader}>
            <Calculator size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Class XII Marks
            </Text>
          </View>
          <View
            style={[
              styles.subjectContainer,
              {
                borderColor: colors.border,
              },
            ]}
          >
            {hasValidMarks(userData?.std_student_master_physics_obt_marks) && (
              <SubjectRow
                subject="Physics"
                obtained={userData?.std_student_master_physics_obt_marks || 0}
                full={userData?.std_student_master_physics_full_marks || 0}
              />
            )}
            {hasValidMarks(
              userData?.std_student_master_chemistry_obt_marks
            ) && (
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
      <View style={styles.academicSection}>
        <View style={styles.sectionHeader}>
          <Award size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Semester Results
          </Text>
        </View>
        <View style={styles.semesterList}>
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

const styles = StyleSheet.create({
  tabContentInner: {
    backgroundColor: "transparent",
  },
  academicSection: {
    marginTop: 3,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    paddingBottom: 4,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  academicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  subjectContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 4,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  semesterList: {
    gap: 12,
    backgroundColor: "transparent",
  },
});
