import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useAlertStore } from "@/src/store/alertStore";
import { useState } from "react";

export function useProfileData() {
  const { studentId, loginData, userData, logout, changePassword } =
    useAuthStore();
  const { showAlert } = useAlertStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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

  return {
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
  };
}
