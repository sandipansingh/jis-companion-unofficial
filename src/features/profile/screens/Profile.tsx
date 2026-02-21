import { Header, View } from "@/src/components";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { LogOut } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
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
  const { isDemoAccount } = useAuthStore();
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
    <View className="flex-1 bg-base">
      <Header
        title="My Profile"
        actionElement={
          <TouchableOpacity
            className="items-center justify-center p-2"
            onPress={handleLogout}
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <LogOut size={22} color="#DC2626" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomOffset + 100 }}
        showsVerticalScrollIndicator={true}
      >
        <View className="p-4 gap-4">
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

          {/* Tab content card */}
          <View
            className="bg-surface dark:bg-surface rounded-2xl border border-border p-5"
            style={{
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
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
                isDemoAccount={isDemoAccount}
              />
            )}

            {activeTab === "guardian" && (
              <GuardianTabContent
                guardianName={userData?.STUDENT_REGISTRATION_DETAIL_sGurName}
                guardianMobile1={userData?.STUDENT_REGISTRATION_DETAIL_sGurMobile}
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

      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </View>
  );
}
