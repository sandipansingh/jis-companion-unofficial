import { TextInput } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string, currentPassword?: string) => Promise<void>;
}

export default function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const { showAlert } = useAlertStore();
  const isWeb = Platform.OS === "web";

  const validatePasswords = (): boolean => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (isWeb && !currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(newPassword, isWeb ? currentPassword : undefined);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      onClose();
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error.message || "Failed to change password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.keyboardView}
          >
            <View
              style={[styles.modalContent, { backgroundColor: colors.surface }]}
            >
              <View>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Change Password
                  </Text>
                </View>

                {/* Current Password Input - Web Only */}
                {isWeb && (
                  <View style={styles.inputContainer}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Current Password
                    </Text>
                    <TextInput
                      icon={Lock}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChangeText={(text) => {
                        setCurrentPassword(text);
                        setErrors({ ...errors, currentPassword: undefined });
                      }}
                      isPassword
                      autoCapitalize="none"
                      editable={!isLoading}
                      bgColor={colors.background}
                    />
                    {errors.currentPassword && (
                      <Text style={[styles.errorText, { color: colors.error }]}>
                        {errors.currentPassword}
                      </Text>
                    )}
                  </View>
                )}

                {/* New Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    New Password
                  </Text>
                  <TextInput
                    icon={Lock}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setErrors({ ...errors, newPassword: undefined });
                    }}
                    isPassword
                    showPasswordToggle={false}
                    autoCapitalize="none"
                    editable={!isLoading}
                    bgColor={colors.background}
                  />
                  {errors.newPassword && (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {errors.newPassword}
                    </Text>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Confirm New Password
                  </Text>
                  <TextInput
                    icon={Lock}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    isPassword
                    autoCapitalize="none"
                    editable={!isLoading}
                    bgColor={colors.background}
                  />
                  {errors.confirmPassword && (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: colors.primary },
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Change Password</Text>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: colors.background },
                  ]}
                  onPress={handleClose}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  keyboardView: {
    width: "100%",
    maxWidth: 500,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
