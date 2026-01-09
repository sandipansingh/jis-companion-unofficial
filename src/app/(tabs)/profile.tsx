import ChangePasswordModal from "@/src/components/ChangePasswordModal";
import { Text, View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useAuthStore } from "@/src/store/authStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import {
  Award,
  Briefcase,
  Calculator,
  Calendar,
  CreditCard,
  Droplet,
  FileText,
  Landmark,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function ProfileScreen() {
  const { studentId, loginData, userData, logout, changePassword } =
    useAuthStore();
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { showAlert } = useAlertStore();

  const handleChangePassword = async (
    newPassword: string,
    currentPassword?: string
  ) => {
    await changePassword(newPassword, currentPassword);
    showAlert({ title: "Success", message: "Password changed successfully" });
  };

  const handleLogout = () => {
    showAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      showCancel: true,
      confirmText: "Logout",
      isDestructive: true,
      onConfirm: logout,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const hasValidMarks = (marks: string | number | undefined) => {
    if (!marks) return false;
    const value = typeof marks === "string" ? parseFloat(marks) : marks;
    return value > 0;
  };
  const hasAcademicHistoryData = () => {
    return (
      hasValidMarks(userData?.marks_x) ||
      hasValidMarks(userData?.marks_xii) ||
      hasValidMarks(userData?.marks_dip) ||
      hasValidMarks(userData?.marks_graduate) ||
      hasValidMarks(userData?.marks_pg)
    );
  };

  const hasSubjectMarks = () => {
    return (
      hasValidMarks(userData?.std_student_master_physics_obt_marks) ||
      hasValidMarks(userData?.std_student_master_chemistry_obt_marks) ||
      hasValidMarks(userData?.std_student_master_math_obt_marks) ||
      hasValidMarks(userData?.std_student_master_english_obt_marks)
    );
  };

  const getSemesterResults = () => {
    const semesters = [];
    for (let i = 1; i <= 6; i++) {
      const sgpaKey =
        `STUDENT_REGISTRATION_DETAIL_sSgpa${i}` as keyof typeof userData;
      const sgpa = userData?.[sgpaKey];
      const sgpaValue = sgpa ? Number(sgpa) : 0;
      semesters.push({
        sem: i,
        sgpa: sgpaValue > 0 ? sgpaValue.toString() : null,
      });
    }
    return semesters;
  };

  const InfoRow = ({
    label,
    value,
    icon: Icon,
    isLast = false,
  }: {
    label: string;
    value: string | undefined;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    isLast?: boolean;
  }) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <View style={styles.infoValueRow}>
          <Icon size={16} color={colors.primary} />
          <Text
            style={[
              styles.infoValue,
              { color: value ? colors.text : colors.textSecondary },
              !value && styles.italicText,
            ]}
          >
            {value || "Not Provided"}
          </Text>
        </View>
      </View>
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
    </View>
  );

  const AcademicCard = ({ title, score }: { title: string; score: string }) => (
    <View style={[styles.academicCard, { borderColor: colors.border }]}>
      <Text style={[styles.academicCardTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.academicCardScore, { color: colors.text }]}>
        {score}
      </Text>
    </View>
  );

  const SubjectRow = ({
    subject,
    obtained,
    full,
  }: {
    subject: string;
    obtained: number;
    full: number;
  }) => (
    <View style={styles.subjectRow}>
      <Text style={[styles.subjectName, { color: colors.text }]}>
        {subject}
      </Text>
      <Text style={[styles.subjectScore, { color: colors.primary }]}>
        {obtained}/{full}
      </Text>
    </View>
  );

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.surface }]}>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          My Profile
        </Text>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity
            style={styles.logoutIconButton}
            onPress={handleLogout}
          >
            <LogOut size={22} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {userData?.profile_pict_cur_url ? (
            <Image
              source={{ uri: userData.profile_pict_cur_url }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={[
                styles.profileImage,
                styles.profilePlaceholder,
                { backgroundColor: colors.primary + "30" },
              ]}
            >
              <Text style={[styles.placeholderText, { color: colors.primary }]}>
                {getInitials(loginData?.student_name || "Student")}
              </Text>
            </View>
          )}
          <Text style={[styles.name, { color: colors.text }]}>
            {loginData?.student_name || "Student"}
          </Text>

          <View style={styles.idRow}>
            <Text style={[styles.studentIdText, { color: colors.primary }]}>
              {studentId || "N/A"}
            </Text>
            <View style={styles.dot} />
            <View style={[styles.semBadge, { backgroundColor: "#DBEAFE" }]}>
              <Text style={[styles.semBadgeText, { color: colors.primary }]}>
                Semester{" "}
                {userData?.STUDENT_REGISTRATION_DETAIL_nSemNo ||
                  loginData?.sem_no ||
                  "N/A"}
              </Text>
            </View>
          </View>

          {/* Registration & Roll Number */}
          {(userData?.STUDENT_REGISTRATION_DETAIL_sReg ||
            userData?.STUDENT_REGISTRATION_DETAIL_sRoll) && (
            <View style={styles.regRollContainer}>
              {userData?.STUDENT_REGISTRATION_DETAIL_sReg && (
                <View
                  style={[
                    styles.regRollBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.regRollLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    REGISTRATION
                  </Text>
                  <Text style={[styles.regRollValue, { color: colors.text }]}>
                    {userData.STUDENT_REGISTRATION_DETAIL_sReg}
                  </Text>
                </View>
              )}
              {userData?.STUDENT_REGISTRATION_DETAIL_sRoll && (
                <View
                  style={[
                    styles.regRollBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.regRollLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    UNIV ROLL
                  </Text>
                  <Text style={[styles.regRollValue, { color: colors.text }]}>
                    {userData.STUDENT_REGISTRATION_DETAIL_sRoll}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Tab Switcher */}
        <View
          style={[styles.tabContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "personal" && [
                styles.activeTab,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("personal")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "personal"
                  ? styles.activeTabText
                  : { color: colors.textSecondary },
              ]}
            >
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "guardian" && [
                styles.activeTab,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("guardian")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "guardian"
                  ? styles.activeTabText
                  : { color: colors.textSecondary },
              ]}
            >
              Guardian
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "bank" && [
                styles.activeTab,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("bank")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "bank"
                  ? styles.activeTabText
                  : { color: colors.textSecondary },
              ]}
            >
              Bank
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "academic" && [
                styles.activeTab,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("academic")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "academic"
                  ? styles.activeTabText
                  : { color: colors.textSecondary },
              ]}
            >
              Academic
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View
          style={[
            styles.tabContent,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {activeTab === "personal" && (
            <View style={styles.tabContentInner}>
              <InfoRow
                label="EMAIL ADDRESS"
                value={userData?.std_adm_email}
                icon={Mail}
              />
              <InfoRow
                label="MOBILE NUMBER"
                value={userData?.std_adm_mobile}
                icon={Phone}
              />
              <InfoRow
                label="DATE OF BIRTH"
                value={userData?.std_dob}
                icon={Calendar}
              />
              <InfoRow
                label="BLOOD GROUP"
                value={userData?.std_blood_group}
                icon={Droplet}
              />
              <InfoRow
                label="PRESENT ADDRESS"
                value={
                  userData?.present_address
                    ? `${userData.present_address}, ${userData.present_city} - ${userData.present_pin}`
                    : undefined
                }
                icon={MapPin}
              />
              <InfoRow
                label="PERMANENT ADDRESS"
                value={
                  userData?.permanemt_address
                    ? `${userData.permanemt_address}, ${userData.permanemt_city} - ${userData.permanemt_pin}`
                    : undefined
                }
                icon={MapPin}
                isLast
              />

              <TouchableOpacity
                style={[
                  styles.changePasswordButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => setShowChangePasswordModal(true)}
              >
                <Lock size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.changePasswordButtonText}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "guardian" && (
            <View style={styles.tabContentInner}>
              <InfoRow
                label="GUARDIAN NAME"
                value={userData?.STUDENT_REGISTRATION_DETAIL_sGurName}
                icon={User}
              />
              <InfoRow
                label="GUARDIAN MOBILE"
                value={
                  userData?.STUDENT_REGISTRATION_DETAIL_sGurMobile &&
                  userData?.gurdian_adm_mobile
                    ? `${userData.STUDENT_REGISTRATION_DETAIL_sGurMobile} | ${userData.gurdian_adm_mobile}`
                    : userData?.STUDENT_REGISTRATION_DETAIL_sGurMobile ||
                      userData?.gurdian_adm_mobile
                }
                icon={Phone}
              />
              <InfoRow
                label="GUARDIAN EMAIL"
                value={
                  userData?.STUDENT_REGISTRATION_DETAIL_sGurEmail &&
                  userData?.gurdian_adm_email
                    ? `${userData.STUDENT_REGISTRATION_DETAIL_sGurEmail} | ${userData.gurdian_adm_email}`
                    : userData?.STUDENT_REGISTRATION_DETAIL_sGurEmail ||
                      userData?.gurdian_adm_email
                }
                icon={Mail}
              />
              <InfoRow
                label="GUARDIAN ADDRESS"
                value={userData?.gurdian_cur_add}
                icon={MapPin}
                isLast
              />
            </View>
          )}

          {activeTab === "bank" && (
            <View style={styles.tabContentInner}>
              <InfoRow
                label="ACCOUNT NUMBER"
                value={userData?.STUDENT_REGISTRATION_DETAIL_sBankAccNo}
                icon={CreditCard}
              />
              <InfoRow
                label="BANK NAME"
                value={userData?.STUDENT_REGISTRATION_DETAIL_sBankName}
                icon={Landmark}
              />
              <InfoRow
                label="BRANCH NAME"
                value={userData?.STUDENT_REGISTRATION_DETAIL_sBankBranch}
                icon={MapPin}
              />
              <InfoRow
                label="IFSC CODE"
                value={userData?.STUDENT_REGISTRATION_DETAIL_sBankIfsc}
                icon={FileText}
                isLast
              />
            </View>
          )}

          {activeTab === "academic" && (
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
                      <AcademicCard
                        title="Class X"
                        score={`${userData?.marks_x}%`}
                      />
                    )}
                    {hasValidMarks(userData?.marks_xii) && (
                      <AcademicCard
                        title="Class XII"
                        score={`${userData?.marks_xii}%`}
                      />
                    )}
                    {hasValidMarks(userData?.marks_dip) && (
                      <AcademicCard
                        title="Diploma"
                        score={`${userData?.marks_dip}%`}
                      />
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
                    {hasValidMarks(
                      userData?.std_student_master_physics_obt_marks
                    ) && (
                      <SubjectRow
                        subject="Physics"
                        obtained={
                          userData?.std_student_master_physics_obt_marks || 0
                        }
                        full={
                          userData?.std_student_master_physics_full_marks || 0
                        }
                      />
                    )}
                    {hasValidMarks(
                      userData?.std_student_master_chemistry_obt_marks
                    ) && (
                      <SubjectRow
                        subject="Chemistry"
                        obtained={
                          userData?.std_student_master_chemistry_obt_marks || 0
                        }
                        full={
                          userData?.std_student_master_chemistry_full_marks || 0
                        }
                      />
                    )}
                    {hasValidMarks(
                      userData?.std_student_master_math_obt_marks
                    ) && (
                      <SubjectRow
                        subject="Mathematics"
                        obtained={
                          userData?.std_student_master_math_obt_marks || 0
                        }
                        full={userData?.std_student_master_math_full_marks || 0}
                      />
                    )}
                    {hasValidMarks(
                      userData?.std_student_master_english_obt_marks
                    ) && (
                      <SubjectRow
                        subject="English"
                        obtained={
                          userData?.std_student_master_english_obt_marks || 0
                        }
                        full={
                          userData?.std_student_master_english_full_marks || 0
                        }
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
                    <View
                      key={result.sem}
                      style={[
                        styles.semesterRow,
                        {
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.semesterText, { color: colors.text }]}
                      >
                        Semester {result.sem}
                      </Text>
                      {result.sgpa ? (
                        <View style={[styles.sgpaBadge, styles.sgpaBadgeGreen]}>
                          <Text style={styles.sgpaText}>
                            SGPA: {result.sgpa}
                          </Text>
                        </View>
                      ) : (
                        <View style={[styles.sgpaBadge, styles.sgpaBadgeGray]}>
                          <Text style={styles.sgpaTextGray}>N/A</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: bottomOffset + 100 }} />
      </ScrollView>

      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    position: "absolute",
    right: 16,
    top: Platform.select({ web: 20, default: 60 }),
    bottom: 16,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  logoutIconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "transparent",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: "#fff",
  },
  profilePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  studentIdText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
  },
  semBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  semBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  regRollContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    maxWidth: 320,
  },
  regRollBox: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  regRollLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  regRollValue: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    minHeight: 50,
  },
  tabContentInner: {
    backgroundColor: "transparent",
  },
  infoRowContainer: {
    backgroundColor: "transparent",
  },
  infoRow: {
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#64748b",
    marginBottom: 8,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  italicText: {
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  changePasswordButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  changePasswordButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  academicSection: {
    marginTop: 20,
    backgroundColor: "transparent",
  },
  academicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "transparent",
  },
  academicCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  academicCardTitle: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  academicCardScore: {
    fontSize: 16,
    fontWeight: "700",
  },
  subjectContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 4,
    backgroundColor: "transparent",
  },
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
  },
  subjectScore: {
    fontSize: 14,
    fontWeight: "700",
  },
  semesterList: {
    gap: 12,
    backgroundColor: "transparent",
  },
  semesterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  semesterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sgpaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sgpaBadgeGreen: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#6ee7b7",
  },
  sgpaBadgeGray: {
    backgroundColor: "#e2e8f0",
  },
  sgpaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  sgpaTextGray: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
});
