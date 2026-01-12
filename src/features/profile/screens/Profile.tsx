import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { LogOut } from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AcademicTabContent,
  BankTabContent,
  ChangePasswordModal,
  GuardianTabContent,
  PersonalTabContent,
  ProfileInfo,
  ProfileTabs,
} from "../components";
import { useProfileData } from "../hooks/useProfileData";

export default function Profile() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const {
    studentId,
    loginData,
    userData,
    activeTab,
    setActiveTab,
    showChangePasswordModal,
    setShowChangePasswordModal,
    handleChangePassword,
    handleLogout,
    getInitials,
    hasValidMarks,
    hasAcademicHistoryData,
    hasSubjectMarks,
    getSemesterResults,
  } = useProfileData();

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={[commonStyles.header, { backgroundColor: colors.surface }]}>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          My Profile
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={commonStyles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomOffset + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ProfileInfo
            name={loginData?.student_name}
            studentId={studentId || undefined}
            semester={loginData?.sem_no}
            registrationNo={userData?.STUDENT_REGISTRATION_DETAIL_sReg}
            rollNo={userData?.STUDENT_REGISTRATION_DETAIL_sRoll}
            profileImageUrl={userData?.profile_pict_cur_url}
            getInitials={getInitials}
          />

          <ProfileTabs
            activeTab={activeTab as any}
            onTabChange={setActiveTab}
          />

          <View
            style={[
              styles.tabContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {activeTab === "personal" && (
              <PersonalTabContent
                email={userData?.std_adm_email}
                mobile={userData?.std_adm_mobile}
                dob={userData?.std_dob}
                bloodGroup={userData?.std_blood_group}
                presentAddress={userData?.present_address}
                presentCity={userData?.present_city}
                presentPin={userData?.present_pin}
                permanentAddress={userData?.permanemt_address}
                permanentCity={userData?.permanemt_city}
                permanentPin={userData?.permanemt_pin}
                onChangePassword={() => setShowChangePasswordModal(true)}
              />
            )}

            {activeTab === "guardian" && (
              <GuardianTabContent
                guardianName={userData?.STUDENT_REGISTRATION_DETAIL_sGurName}
                guardianMobile1={
                  userData?.STUDENT_REGISTRATION_DETAIL_sGurMobile
                }
                guardianMobile2={userData?.gurdian_adm_mobile}
                guardianEmail1={userData?.STUDENT_REGISTRATION_DETAIL_sGurEmail}
                guardianEmail2={userData?.gurdian_adm_email}
                guardianAddress={userData?.gurdian_cur_add}
              />
            )}

            {activeTab === "bank" && (
              <BankTabContent
                accountNumber={userData?.STUDENT_REGISTRATION_DETAIL_sBankAccNo}
                bankName={userData?.STUDENT_REGISTRATION_DETAIL_sBankName}
                branchName={userData?.STUDENT_REGISTRATION_DETAIL_sBankBranch}
                ifscCode={userData?.STUDENT_REGISTRATION_DETAIL_sBankIfsc}
              />
            )}

            {activeTab === "academic" && (
              <AcademicTabContent
                userData={userData || undefined}
                hasAcademicHistoryData={hasAcademicHistoryData}
                hasValidMarks={hasValidMarks}
                hasSubjectMarks={hasSubjectMarks}
                getSemesterResults={getSemesterResults as any}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    right: 16,
    top: Platform.select({ web: 16, default: 60 }),
    justifyContent: "center",
    alignItems: "center",
    padding: Platform.select({ web: 12, default: 8 }),
  },
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  tabContent: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
});
