import { useAlertStore } from "@/src/store/alertStore";
import { useState } from "react";
import { useAuthStore } from "../store";

export function useLoginData() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlertStore();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter both Student ID and Password",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(studentId.trim(), password.trim());
      if (!success) {
        showAlert({
          title: "Login Failed",
          message: "Invalid Student ID or Password. Please try again.",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error.message || "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  const showCredits = () => {
    showAlert({
      title: "Credits",
      message: "Password icons created by Roundicons Premium - Flaticon",
    });
  };

  return {
    studentId,
    password,
    loading,
    setStudentId,
    setPassword,
    handleLogin,
    showCredits,
  };
}
